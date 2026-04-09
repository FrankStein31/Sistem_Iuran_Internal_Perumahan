<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\House;
use App\Models\HouseResident;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HouseController extends Controller
{
    public function index(Request $request)
    {
        $query = House::with(['currentResident']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nomor_rumah', 'like', '%' . $request->search . '%')
                  ->orWhere('alamat', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->status_hunian) {
            $query->where('status_hunian', $request->status_hunian);
        }

        $houses = $query->orderByRaw("CAST(nomor_rumah AS UNSIGNED)")->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $houses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'required|string|max:10|unique:houses,nomor_rumah',
            'alamat'      => 'required|string|max:255',
            'keterangan'  => 'nullable|string',
        ]);

        $validated['status_hunian'] = 'tidak_dihuni';
        $house = House::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Rumah berhasil ditambahkan',
            'data' => $house,
        ], 201);
    }

    public function show(House $house)
    {
        $house->load([
            'currentResident',
            'houseResidents.resident',
            'payments' => function ($q) {
                $q->orderBy('tahun', 'desc')->orderBy('bulan', 'desc');
            },
            'payments.resident',
        ]);

        return response()->json([
            'success' => true,
            'data' => $house,
        ]);
    }

    public function update(Request $request, House $house)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'required|string|max:10|unique:houses,nomor_rumah,' . $house->id,
            'alamat'      => 'required|string|max:255',
            'keterangan'  => 'nullable|string',
        ]);

        $house->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data rumah berhasil diperbarui',
            'data' => $house->fresh(['currentResident']),
        ]);
    }

    public function destroy(House $house)
    {
        if ($house->status_hunian === 'dihuni') {
            return response()->json([
                'success' => false,
                'message' => 'Rumah masih dihuni. Pindahkan penghuni terlebih dahulu.',
            ], 422);
        }

        $house->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rumah berhasil dihapus',
        ]);
    }

    public function assignResident(Request $request, House $house)
    {
        $validated = $request->validate([
            'resident_id'   => 'required|exists:residents,id',
            'tanggal_masuk' => 'required|date',
            'catatan'       => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Check if house already occupied
            if ($house->status_hunian === 'dihuni') {
                return response()->json([
                    'success' => false,
                    'message' => 'Rumah sudah dihuni. Pindahkan penghuni sebelumnya terlebih dahulu.',
                ], 422);
            }

            // Check if resident already in another active house
            $existingActive = HouseResident::where('resident_id', $validated['resident_id'])
                ->where('is_active', true)
                ->first();

            if ($existingActive) {
                return response()->json([
                    'success' => false,
                    'message' => 'Penghuni sudah menempati rumah lain.',
                ], 422);
            }

            // Create house resident record
            HouseResident::create([
                'house_id'      => $house->id,
                'resident_id'   => $validated['resident_id'],
                'tanggal_masuk' => $validated['tanggal_masuk'],
                'is_active'     => true,
                'catatan'       => $validated['catatan'] ?? null,
            ]);

            // Update house status
            $house->update([
                'status_hunian'       => 'dihuni',
                'current_resident_id' => $validated['resident_id'],
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penghuni berhasil ditetapkan ke rumah',
                'data'    => $house->fresh(['currentResident']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function removeResident(Request $request, House $house)
    {
        $validated = $request->validate([
            'tanggal_keluar' => 'required|date',
            'catatan'        => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            if ($house->status_hunian === 'tidak_dihuni') {
                return response()->json([
                    'success' => false,
                    'message' => 'Rumah tidak sedang dihuni.',
                ], 422);
            }

            // Close active house resident record
            $activeRecord = HouseResident::where('house_id', $house->id)
                ->where('is_active', true)
                ->first();

            if ($activeRecord) {
                $activeRecord->update([
                    'tanggal_keluar' => $validated['tanggal_keluar'],
                    'is_active'      => false,
                    'catatan'        => $validated['catatan'] ?? $activeRecord->catatan,
                ]);
            }

            // Update house status
            $house->update([
                'status_hunian'       => 'tidak_dihuni',
                'current_resident_id' => null,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penghuni berhasil dipindahkan dari rumah',
                'data'    => $house->fresh(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function all()
    {
        $houses = House::with('currentResident')
            ->orderByRaw("CAST(nomor_rumah AS UNSIGNED)")
            ->get(['id', 'nomor_rumah', 'alamat', 'status_hunian', 'current_resident_id']);

        return response()->json([
            'success' => true,
            'data' => $houses,
        ]);
    }
}
