<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\House;
use App\Models\Resident;
use App\Models\HouseResident;
use App\Models\Payment;
use App\Models\Expense;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@rt.com'],
            [
                'name'     => 'Admin RT',
                'email'    => 'admin@rt.com',
                'password' => Hash::make('password'),
            ]
        );

        // Create 20 houses
        $houses = [];
        for ($i = 1; $i <= 20; $i++) {
            $houses[] = House::updateOrCreate(
                ['nomor_rumah' => (string) $i],
                [
                    'nomor_rumah'   => (string) $i,
                    'alamat'        => 'Jl. Perumahan Elite Blok A No. ' . $i,
                    'status_hunian' => 'tidak_dihuni',
                ]
            );
        }

        // Create sample residents (15 tetap, 5 kontrak)
        $residentsData = [
            // Tetap (1-15)
            ['nama_lengkap' => 'Budi Santoso',       'no_ktp' => '3201010101010001', 'status_penghuni' => 'tetap',   'no_hp' => '081234567801', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Siti Rahayu',         'no_ktp' => '3201010101010002', 'status_penghuni' => 'tetap',   'no_hp' => '081234567802', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Ahmad Fauzi',         'no_ktp' => '3201010101010003', 'status_penghuni' => 'tetap',   'no_hp' => '081234567803', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Dewi Lestari',        'no_ktp' => '3201010101010004', 'status_penghuni' => 'tetap',   'no_hp' => '081234567804', 'status_nikah' => 'belum_menikah'],
            ['nama_lengkap' => 'Hendra Gunawan',      'no_ktp' => '3201010101010005', 'status_penghuni' => 'tetap',   'no_hp' => '081234567805', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Ratna Sari',          'no_ktp' => '3201010101010006', 'status_penghuni' => 'tetap',   'no_hp' => '081234567806', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Doni Kurniawan',      'no_ktp' => '3201010101010007', 'status_penghuni' => 'tetap',   'no_hp' => '081234567807', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Yuli Handayani',      'no_ktp' => '3201010101010008', 'status_penghuni' => 'tetap',   'no_hp' => '081234567808', 'status_nikah' => 'belum_menikah'],
            ['nama_lengkap' => 'Rudi Hermawan',       'no_ktp' => '3201010101010009', 'status_penghuni' => 'tetap',   'no_hp' => '081234567809', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Nia Puspita',         'no_ktp' => '3201010101010010', 'status_penghuni' => 'tetap',   'no_hp' => '081234567810', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Fajar Nugroho',       'no_ktp' => '3201010101010011', 'status_penghuni' => 'tetap',   'no_hp' => '081234567811', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Eka Wahyuni',         'no_ktp' => '3201010101010012', 'status_penghuni' => 'tetap',   'no_hp' => '081234567812', 'status_nikah' => 'belum_menikah'],
            ['nama_lengkap' => 'Agus Prasetyo',       'no_ktp' => '3201010101010013', 'status_penghuni' => 'tetap',   'no_hp' => '081234567813', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Sri Mulyani',         'no_ktp' => '3201010101010014', 'status_penghuni' => 'tetap',   'no_hp' => '081234567814', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Bambang Wijaya',      'no_ktp' => '3201010101010015', 'status_penghuni' => 'tetap',   'no_hp' => '081234567815', 'status_nikah' => 'menikah'],
            // Kontrak (16-20)
            ['nama_lengkap' => 'Rizki Maulana',       'no_ktp' => '3201010101010016', 'status_penghuni' => 'kontrak', 'no_hp' => '081234567816', 'status_nikah' => 'belum_menikah'],
            ['nama_lengkap' => 'Anisa Putri',         'no_ktp' => '3201010101010017', 'status_penghuni' => 'kontrak', 'no_hp' => '081234567817', 'status_nikah' => 'belum_menikah'],
            ['nama_lengkap' => 'Dian Permata',        'no_ktp' => '3201010101010018', 'status_penghuni' => 'kontrak', 'no_hp' => '081234567818', 'status_nikah' => 'menikah'],
            ['nama_lengkap' => 'Citra Melinda',       'no_ktp' => '3201010101010019', 'status_penghuni' => 'kontrak', 'no_hp' => '081234567819', 'status_nikah' => 'belum_menikah'],
            ['nama_lengkap' => 'Wahyu Setiawan',      'no_ktp' => '3201010101010020', 'status_penghuni' => 'kontrak', 'no_hp' => '081234567820', 'status_nikah' => 'menikah'],
        ];

        $residents = [];
        foreach ($residentsData as $data) {
            $residents[] = Resident::updateOrCreate(['no_ktp' => $data['no_ktp']], $data);
        }

        // Assign residents to houses 1-15 (tetap) and 16-17 (kontrak occupied)
        $assignments = [];
        for ($i = 0; $i < 15; $i++) {
            $assignments[] = [$houses[$i], $residents[$i]];
        }
        // 2 kontrak houses occupied (houses 16 & 17)
        $assignments[] = [$houses[15], $residents[15]];
        $assignments[] = [$houses[16], $residents[16]];

        foreach ($assignments as [$house, $resident]) {
            // Create house resident record
            HouseResident::updateOrCreate(
                ['house_id' => $house->id, 'resident_id' => $resident->id],
                [
                    'tanggal_masuk' => now()->subMonths(6)->startOfMonth(),
                    'is_active'     => true,
                ]
            );

            // Update house status
            $house->update([
                'status_hunian'       => 'dihuni',
                'current_resident_id' => $resident->id,
            ]);
        }

        // Generate sample payments for last 3 months
        $occupiedHouses = House::where('status_hunian', 'dihuni')->with('currentResident')->get();

        for ($monthOffset = 2; $monthOffset >= 0; $monthOffset--) {
            $date  = now()->subMonths($monthOffset);
            $bulan = $date->month;
            $tahun = $date->year;

            foreach ($occupiedHouses as $house) {
                foreach (['satpam', 'kebersihan'] as $jenis) {
                    $isPaid = $monthOffset > 0; // Past months are paid, current is unpaid
                    Payment::updateOrCreate(
                        [
                            'house_id'    => $house->id,
                            'jenis_iuran' => $jenis,
                            'bulan'       => $bulan,
                            'tahun'       => $tahun,
                        ],
                        [
                            'resident_id'   => $house->current_resident_id,
                            'jumlah'        => $jenis === 'satpam' ? 100000 : 15000,
                            'status'        => $isPaid ? 'paid' : 'unpaid',
                            'tanggal_bayar' => $isPaid ? $date->copy()->setDay(5) : null,
                        ]
                    );
                }
            }
        }

        // Sample expenses
        $expensesData = [
            ['tanggal' => now()->subMonths(2)->setDay(10), 'deskripsi' => 'Token listrik pos satpam',   'jumlah' => 150000,  'kategori' => 'listrik'],
            ['tanggal' => now()->subMonths(2)->setDay(15), 'deskripsi' => 'Perbaikan selokan depan',     'jumlah' => 500000,  'kategori' => 'perbaikan_selokan'],
            ['tanggal' => now()->subMonths(1)->setDay(5),  'deskripsi' => 'Gaji satpam bulan lalu',     'jumlah' => 1500000, 'kategori' => 'gaji_satpam'],
            ['tanggal' => now()->subMonths(1)->setDay(10), 'deskripsi' => 'Token listrik pos satpam',   'jumlah' => 150000,  'kategori' => 'listrik'],
            ['tanggal' => now()->subMonths(1)->setDay(20), 'deskripsi' => 'Cat pagar perumahan',        'jumlah' => 300000,  'kategori' => 'umum'],
            ['tanggal' => now()->setDay(5),                'deskripsi' => 'Gaji satpam bulan ini',       'jumlah' => 1500000, 'kategori' => 'gaji_satpam'],
            ['tanggal' => now()->setDay(8),                'deskripsi' => 'Token listrik pos satpam',   'jumlah' => 150000,  'kategori' => 'listrik'],
            ['tanggal' => now()->setDay(12),               'deskripsi' => 'Perbaikan jalan retak',      'jumlah' => 750000,  'kategori' => 'perbaikan_jalan'],
        ];

        foreach ($expensesData as $data) {
            Expense::create($data);
        }
    }
}
