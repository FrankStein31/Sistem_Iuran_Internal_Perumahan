<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\House;
use App\Models\Resident;
use App\Models\Payment;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $currentYear = now()->year;
        $currentMonth = now()->month;

        // Summary Cards
        $totalHouses = House::count();
        $occupiedHouses = House::where('status_hunian', 'dihuni')->count();
        $totalResidents = Resident::count();
        $totalResidentsTetap = Resident::where('status_penghuni', 'tetap')->count();
        $totalResidentsKontrak = Resident::where('status_penghuni', 'kontrak')->count();

        // Current month income
        $currentMonthIncome = Payment::where('status', 'paid')
            ->where('bulan', $currentMonth)
            ->where('tahun', $currentYear)
            ->sum('jumlah');

        // Current month expense
        $currentMonthExpense = Expense::whereYear('tanggal', $currentYear)
            ->whereMonth('tanggal', $currentMonth)
            ->sum('jumlah');

        // Unpaid payments current month
        $unpaidCount = Payment::where('status', 'unpaid')
            ->where('bulan', $currentMonth)
            ->where('tahun', $currentYear)
            ->count();

        // Chart data: last 12 months income vs expense
        $chartData = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $m = $date->month;
            $y = $date->year;

            $income = Payment::where('status', 'paid')
                ->where('bulan', $m)
                ->where('tahun', $y)
                ->sum('jumlah');

            $expense = Expense::whereYear('tanggal', $y)
                ->whereMonth('tanggal', $m)
                ->sum('jumlah');

            $namaBulan = [
                1=>'Jan',2=>'Feb',3=>'Mar',4=>'Apr',5=>'Mei',6=>'Jun',
                7=>'Jul',8=>'Agu',9=>'Sep',10=>'Okt',11=>'Nov',12=>'Des'
            ];

            $chartData[] = [
                'bulan' => $namaBulan[$m] . ' ' . $y,
                'pemasukan' => (float) $income,
                'pengeluaran' => (float) $expense,
                'saldo' => (float) ($income - $expense),
            ];
        }

        // Recent payments
        $recentPayments = Payment::with(['house', 'resident'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Recent expenses
        $recentExpenses = Expense::orderBy('tanggal', 'desc')
            ->limit(5)
            ->get();

        // Payment status per jenis this month
        $paymentStatusSatpam = [
            'paid' => Payment::where('jenis_iuran', 'satpam')->where('bulan', $currentMonth)->where('tahun', $currentYear)->where('status', 'paid')->count(),
            'unpaid' => Payment::where('jenis_iuran', 'satpam')->where('bulan', $currentMonth)->where('tahun', $currentYear)->where('status', 'unpaid')->count(),
        ];
        $paymentStatusKebersihan = [
            'paid' => Payment::where('jenis_iuran', 'kebersihan')->where('bulan', $currentMonth)->where('tahun', $currentYear)->where('status', 'paid')->count(),
            'unpaid' => Payment::where('jenis_iuran', 'kebersihan')->where('bulan', $currentMonth)->where('tahun', $currentYear)->where('status', 'unpaid')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_rumah' => $totalHouses,
                    'rumah_dihuni' => $occupiedHouses,
                    'rumah_kosong' => $totalHouses - $occupiedHouses,
                    'total_penghuni' => $totalResidents,
                    'penghuni_tetap' => $totalResidentsTetap,
                    'penghuni_kontrak' => $totalResidentsKontrak,
                    'pemasukan_bulan_ini' => (float) $currentMonthIncome,
                    'pengeluaran_bulan_ini' => (float) $currentMonthExpense,
                    'saldo_bulan_ini' => (float) ($currentMonthIncome - $currentMonthExpense),
                    'tagihan_belum_bayar' => $unpaidCount,
                ],
                'chart_data' => $chartData,
                'recent_payments' => $recentPayments,
                'recent_expenses' => $recentExpenses,
                'payment_status' => [
                    'satpam' => $paymentStatusSatpam,
                    'kebersihan' => $paymentStatusKebersihan,
                ],
            ],
        ]);
    }

    public function monthlyReport(Request $request)
    {
        $bulan = $request->get('bulan', now()->month);
        $tahun = $request->get('tahun', now()->year);

        $payments = Payment::with(['house', 'resident'])
            ->where('bulan', $bulan)
            ->where('tahun', $tahun)
            ->orderBy('house_id')
            ->get();

        $expenses = Expense::whereYear('tanggal', $tahun)
            ->whereMonth('tanggal', $bulan)
            ->orderBy('tanggal')
            ->get();

        $totalPemasukan = $payments->where('status', 'paid')->sum('jumlah');
        $totalPengeluaran = $expenses->sum('jumlah');

        $namaBulan = [
            1=>'Januari',2=>'Februari',3=>'Maret',4=>'April',5=>'Mei',6=>'Juni',
            7=>'Juli',8=>'Agustus',9=>'September',10=>'Oktober',11=>'November',12=>'Desember'
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'bulan' => $bulan,
                'tahun' => $tahun,
                'nama_bulan' => $namaBulan[$bulan] ?? '',
                'payments' => $payments,
                'expenses' => $expenses,
                'summary' => [
                    'total_pemasukan' => (float) $totalPemasukan,
                    'total_pengeluaran' => (float) $totalPengeluaran,
                    'saldo' => (float) ($totalPemasukan - $totalPengeluaran),
                ],
            ],
        ]);
    }
}
