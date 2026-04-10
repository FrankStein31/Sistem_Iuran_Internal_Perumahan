<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('deskripsi', 'like', '%' . $request->search . '%')
                  ->orWhere('kategori', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->kategori) {
            $query->where('kategori', $request->kategori);
        }

        if ($request->bulan && $request->tahun) {
            $query->whereMonth('tanggal', $request->bulan)
                  ->whereYear('tanggal', $request->tahun);
        } elseif ($request->tahun) {
            $query->whereYear('tanggal', $request->tahun);
        }

        if ($request->date_from) {
            $query->where('tanggal', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->where('tanggal', '<=', $request->date_to);
        }

        $totalQuery = Expense::query();
        if ($request->bulan && $request->tahun) {
            $totalQuery->whereMonth('tanggal', $request->bulan)->whereYear('tanggal', $request->tahun);
        } elseif ($request->tahun) {
            $totalQuery->whereYear('tanggal', $request->tahun);
        }
        $total = $totalQuery->sum('jumlah');

        if ($request->per_page === 'all') {
            $expenses = $query->orderBy('tanggal', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => ['data' => $expenses],
                'total' => (float) $total,
            ]);
        }

        $expenses = $query->orderBy('tanggal', 'desc')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $expenses,
            'total' => (float) $total,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal'   => 'required|date',
            'deskripsi' => 'required|string|max:255',
            'jumlah'    => 'required|numeric|min:0',
            'kategori'  => 'required|string|max:100',
            'bukti'     => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'catatan'   => 'nullable|string',
        ]);

        if ($request->hasFile('bukti')) {
            $path = $request->file('bukti')->store('expenses', 'public');
            $validated['bukti'] = $path;
        }

        $expense = Expense::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pengeluaran berhasil ditambahkan',
            'data' => $expense,
        ], 201);
    }

    public function show(Expense $expense)
    {
        return response()->json([
            'success' => true,
            'data' => $expense,
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'tanggal'   => 'required|date',
            'deskripsi' => 'required|string|max:255',
            'jumlah'    => 'required|numeric|min:0',
            'kategori'  => 'required|string|max:100',
            'bukti'     => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'catatan'   => 'nullable|string',
        ]);

        if ($request->hasFile('bukti')) {
            if ($expense->bukti) {
                Storage::disk('public')->delete($expense->bukti);
            }
            $path = $request->file('bukti')->store('expenses', 'public');
            $validated['bukti'] = $path;
        }

        $expense->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pengeluaran berhasil diperbarui',
            'data' => $expense->fresh(),
        ]);
    }

    public function destroy(Expense $expense)
    {
        if ($expense->bukti) {
            Storage::disk('public')->delete($expense->bukti);
        }
        $expense->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pengeluaran berhasil dihapus',
        ]);
    }

    public function categories()
    {
        return response()->json([
            'success' => true,
            'data' => [
                ['value' => 'listrik', 'label' => 'Listrik'],
                ['value' => 'perbaikan_jalan', 'label' => 'Perbaikan Jalan'],
                ['value' => 'perbaikan_selokan', 'label' => 'Perbaikan Selokan'],
                ['value' => 'gaji_satpam', 'label' => 'Gaji Satpam'],
                ['value' => 'kebersihan', 'label' => 'Kebersihan'],
                ['value' => 'administrasi', 'label' => 'Administrasi'],
                ['value' => 'umum', 'label' => 'Umum'],
            ],
        ]);
    }
}
