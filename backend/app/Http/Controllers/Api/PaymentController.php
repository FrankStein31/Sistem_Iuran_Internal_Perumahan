<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\House;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['house', 'resident']);

        if ($request->bulan) {
            $query->where('bulan', $request->bulan);
        }
        if ($request->tahun) {
            $query->where('tahun', $request->tahun);
        }
        if ($request->jenis_iuran) {
            $query->where('jenis_iuran', $request->jenis_iuran);
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->house_id) {
            $query->where('house_id', $request->house_id);
        }
        if ($request->search) {
            $query->whereHas('house', function ($q) use ($request) {
                $q->where('nomor_rumah', 'like', '%' . $request->search . '%')
                  ->orWhere('alamat', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->per_page === 'all') {
            $payments = $query->orderBy('tahun', 'desc')
                ->orderBy('bulan', 'desc')
                ->orderBy('jenis_iuran')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [ 'data' => $payments ],
            ]);
        }

        $payments = $query->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->orderBy('jenis_iuran')
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $payments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_id'    => 'required|exists:houses,id',
            'resident_id' => 'nullable|exists:residents,id',
            'jenis_iuran' => 'required|in:satpam,kebersihan',
            'bulan'       => 'required|integer|min:1|max:12',
            'tahun'       => 'required|integer|min:2020|max:2100',
            'jumlah'      => 'required|numeric|min:0',
            'status'      => 'required|in:paid,unpaid',
            'tanggal_bayar' => 'nullable|date',
            'catatan'     => 'nullable|string',
        ]);

        // Check for duplicate
        $exists = Payment::where('house_id', $validated['house_id'])
            ->where('jenis_iuran', $validated['jenis_iuran'])
            ->where('bulan', $validated['bulan'])
            ->where('tahun', $validated['tahun'])
            ->first();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Data pembayaran untuk rumah, jenis, bulan, dan tahun ini sudah ada.',
            ], 422);
        }

        $payment = Payment::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pembayaran berhasil ditambahkan',
            'data' => $payment->load(['house', 'resident']),
        ], 201);
    }

    public function show(Payment $payment)
    {
        return response()->json([
            'success' => true,
            'data' => $payment->load(['house', 'resident']),
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'jenis_iuran'   => 'required|in:satpam,kebersihan',
            'bulan'         => 'required|integer|min:1|max:12',
            'tahun'         => 'required|integer|min:2020|max:2100',
            'jumlah'        => 'required|numeric|min:0',
            'status'        => 'required|in:paid,unpaid',
            'tanggal_bayar' => 'nullable|date',
            'catatan'       => 'nullable|string',
        ]);

        $payment->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pembayaran berhasil diperbarui',
            'data' => $payment->fresh(['house', 'resident']),
        ]);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pembayaran berhasil dihapus',
        ]);
    }

    public function markPaid(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'tanggal_bayar' => 'required|date',
            'catatan'       => 'nullable|string',
        ]);

        $payment->update([
            'status'        => 'paid',
            'tanggal_bayar' => $validated['tanggal_bayar'],
            'catatan'       => $validated['catatan'] ?? $payment->catatan,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran berhasil ditandai lunas',
            'data' => $payment->fresh(['house', 'resident']),
        ]);
    }

    /**
     * Generate payment records for all occupied houses for a given month/year
     */
    public function generateBulk(Request $request)
    {
        $validated = $request->validate([
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2020|max:2100',
        ]);

        $jumlahSatpam = 100000;
        $jumlahKebersihan = 15000;

        // Get all houses
        $houses = House::with('currentResident')->get();

        DB::beginTransaction();
        try {
            $created = 0;
            $skipped = 0;

            foreach ($houses as $house) {
                // Only bill occupied houses (or tetap resident houses)
                // Occasional houses (kontrak) only billed when occupied
                $shouldBill = false;

                if ($house->status_hunian === 'dihuni') {
                    $shouldBill = true;
                } elseif ($house->currentResident && $house->currentResident->status_penghuni === 'tetap') {
                    // Tetap resident always billed even if house appears empty (edge case)
                    $shouldBill = true;
                }

                if (!$shouldBill) {
                    // For tetap residents in unoccupied houses - still bill them
                    // Actually by spec: tetap = billed monthly, kontrak = only when occupied
                    // Since all tetap residents should always be in "dihuni" houses, skip unoccupied
                    $skipped++;
                    continue;
                }

                $residentId = $house->current_resident_id;

                foreach (['satpam', 'kebersihan'] as $jenis) {
                    $exists = Payment::where('house_id', $house->id)
                        ->where('jenis_iuran', $jenis)
                        ->where('bulan', $validated['bulan'])
                        ->where('tahun', $validated['tahun'])
                        ->exists();

                    if (!$exists) {
                        Payment::create([
                            'house_id'    => $house->id,
                            'resident_id' => $residentId,
                            'jenis_iuran' => $jenis,
                            'bulan'       => $validated['bulan'],
                            'tahun'       => $validated['tahun'],
                            'jumlah'      => $jenis === 'satpam' ? $jumlahSatpam : $jumlahKebersihan,
                            'status'      => 'unpaid',
                        ]);
                        $created++;
                    } else {
                        $skipped++;
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Berhasil membuat {$created} tagihan baru, {$skipped} tagihan dilewati (sudah ada atau rumah tidak dihuni).",
                'data' => [
                    'created' => $created,
                    'skipped' => $skipped,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Advance payment - pay kebersihan for multiple months at once
     */
    public function advancePay(Request $request)
    {
        $validated = $request->validate([
            'house_id'        => 'required|exists:houses,id',
            'resident_id'     => 'nullable|exists:residents,id',
            'jenis_iuran'     => 'required|in:kebersihan',
            'bulan_mulai'     => 'required|integer|min:1|max:12',
            'tahun_mulai'     => 'required|integer|min:2020|max:2100',
            'jumlah_bulan'    => 'required|integer|min:1|max:12',
            'tanggal_bayar'   => 'required|date',
            'catatan'         => 'nullable|string',
        ]);

        $jumlah = 15000; // kebersihan rate
        $created = 0;
        $updated = 0;

        DB::beginTransaction();
        try {
            $bulan = $validated['bulan_mulai'];
            $tahun = $validated['tahun_mulai'];

            for ($i = 0; $i < $validated['jumlah_bulan']; $i++) {
                $existing = Payment::where('house_id', $validated['house_id'])
                    ->where('jenis_iuran', 'kebersihan')
                    ->where('bulan', $bulan)
                    ->where('tahun', $tahun)
                    ->first();

                if ($existing) {
                    $existing->update([
                        'status'        => 'paid',
                        'tanggal_bayar' => $validated['tanggal_bayar'],
                        'catatan'       => ($validated['catatan'] ?? '') . ' (Bayar dimuka)',
                    ]);
                    $updated++;
                } else {
                    Payment::create([
                        'house_id'      => $validated['house_id'],
                        'resident_id'   => $validated['resident_id'],
                        'jenis_iuran'   => 'kebersihan',
                        'bulan'         => $bulan,
                        'tahun'         => $tahun,
                        'jumlah'        => $jumlah,
                        'status'        => 'paid',
                        'tanggal_bayar' => $validated['tanggal_bayar'],
                        'catatan'       => ($validated['catatan'] ?? '') . ' (Bayar dimuka)',
                    ]);
                    $created++;
                }

                // Move to next month
                $bulan++;
                if ($bulan > 12) {
                    $bulan = 1;
                    $tahun++;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Bayar dimuka berhasil: {$created} tagihan baru, {$updated} tagihan diperbarui.",
                'data' => ['created' => $created, 'updated' => $updated],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
