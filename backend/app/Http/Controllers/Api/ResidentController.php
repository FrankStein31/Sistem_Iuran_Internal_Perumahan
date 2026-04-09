<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ResidentController extends Controller
{
    public function index(Request $request)
    {
        $query = Resident::with(['currentHouseResident.house']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('no_ktp', 'like', '%' . $request->search . '%')
                  ->orWhere('no_hp', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->status_penghuni) {
            $query->where('status_penghuni', $request->status_penghuni);
        }

        if ($request->status_nikah) {
            $query->where('status_nikah', $request->status_nikah);
        }

        $residents = $query->orderBy('nama_lengkap')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $residents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap'   => 'required|string|max:255',
            'no_ktp'         => 'required|string|size:16|unique:residents,no_ktp',
            'foto_ktp'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status_penghuni'=> 'required|in:tetap,kontrak',
            'no_hp'          => 'required|string|max:20',
            'status_nikah'   => 'required|in:menikah,belum_menikah',
            'catatan'        => 'nullable|string',
        ]);

        if ($request->hasFile('foto_ktp')) {
            $path = $request->file('foto_ktp')->store('ktp', 'public');
            $validated['foto_ktp'] = $path;
        }

        $resident = Resident::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Penghuni berhasil ditambahkan',
            'data' => $resident,
        ], 201);
    }

    public function show(Resident $resident)
    {
        $resident->load([
            'houseResidents.house',
            'payments.house',
        ]);

        return response()->json([
            'success' => true,
            'data' => $resident,
        ]);
    }

    public function update(Request $request, Resident $resident)
    {
        $validated = $request->validate([
            'nama_lengkap'   => 'required|string|max:255',
            'no_ktp'         => ['required', 'string', 'size:16', Rule::unique('residents', 'no_ktp')->ignore($resident->id)],
            'foto_ktp'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status_penghuni'=> 'required|in:tetap,kontrak',
            'no_hp'          => 'required|string|max:20',
            'status_nikah'   => 'required|in:menikah,belum_menikah',
            'catatan'        => 'nullable|string',
        ]);

        if ($request->hasFile('foto_ktp')) {
            // Delete old photo
            if ($resident->foto_ktp) {
                Storage::disk('public')->delete($resident->foto_ktp);
            }
            $path = $request->file('foto_ktp')->store('ktp', 'public');
            $validated['foto_ktp'] = $path;
        }

        $resident->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data penghuni berhasil diperbarui',
            'data' => $resident->fresh(),
        ]);
    }

    public function destroy(Resident $resident)
    {
        // Check if resident is currently occupying a house
        if ($resident->currentHouseResident) {
            return response()->json([
                'success' => false,
                'message' => 'Penghuni masih menempati rumah. Pindahkan penghuni terlebih dahulu.',
            ], 422);
        }

        if ($resident->foto_ktp) {
            Storage::disk('public')->delete($resident->foto_ktp);
        }

        $resident->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data penghuni berhasil dihapus',
        ]);
    }

    public function all()
    {
        $residents = Resident::orderBy('nama_lengkap')->get(['id', 'nama_lengkap', 'no_ktp', 'status_penghuni', 'no_hp']);

        return response()->json([
            'success' => true,
            'data' => $residents,
        ]);
    }
}
