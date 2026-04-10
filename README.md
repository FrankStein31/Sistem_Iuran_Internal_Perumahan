# Sistem Administrasi RT Perumahan Elite

Sistem manajemen iuran dan data warga tingkat Rukun Tetangga (RT) berbasis **Headless API** menggunakan **Laravel 13** (Backend) dan **React 18 + Vite** (Frontend SPA).

## Fitur Utama

- **Autentikasi** — Login aman via Laravel Sanctum, edit profil admin <br>
<img width="1761" height="1011" alt="image" src="https://github.com/user-attachments/assets/f01dba59-9ca0-4a2e-a7b7-87db515de673" />
<br>
<img width="1761" height="1011" alt="image" src="https://github.com/user-attachments/assets/cd3ec1c4-5d9f-45af-be56-395dcacd813c" />
<br>

- **Dashboard** — Statistik realtime: pendapatan, pengeluaran, saldo, dan grafik 12 bulan <br>
<img width="1761" height="1088" alt="image" src="https://github.com/user-attachments/assets/52d272a9-af1a-4732-874e-2918a51565eb" />
<br>

- **Manajemen Penghuni** — CRUD data penghuni tetap/kontrak beserta upload foto KTP <br>
<img width="1761" height="1045" alt="image" src="https://github.com/user-attachments/assets/7eba275c-3239-49c2-a7a9-123de7caf49e" />
<br>

- **Manajemen Rumah** — Pengelolaan rumah dan riwayat historis penghuni masuk/keluar <br>
<img width="1761" height="1011" alt="image" src="https://github.com/user-attachments/assets/354f0466-28be-4b09-9d8b-4187b5ec1d22" />
<br>

- **Manajemen Iuran** — Tagihan satpam & kebersihan, bulk generate bulanan, export Excel <br>
<img width="1761" height="1011" alt="image" src="https://github.com/user-attachments/assets/5c41086b-8823-4232-b52e-8ac137f92de2" />
<br>

- **Manajemen Pengeluaran** — Arsip kas keluar dengan kategori & pencatatan tanggal <br>
<img width="1761" height="1011" alt="image" src="https://github.com/user-attachments/assets/597cd943-1439-4bfe-b786-d32cb4fe3600" />
<br>

---

## Tech Stack

- **Backend:** Laravel 13, PHP 8.3+, MySQL/MariaDB, Laravel Sanctum
- **Frontend:** React 18, Vite, Tailwind CSS v4, Axios, React Router v7, Recharts, Lucide React, react-data-table-component, xlsx

---

## Prasyarat Sistem

Sebelum memulai instalasi, pastikan perangkat lunak berikut sudah terpasang:

| Perangkat Lunak | Versi Minimum | Cek Versi |
|---|---|---|
| **PHP** | 8.3+ | `php -v` |
| **Composer** | 2.x | `composer -V` |
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **MySQL / MariaDB** | 8.0+ / 10.4+ | `mysql --version` |
| **Git** | terbaru | `git --version` |

> **Rekomendasi:** Gunakan [Laragon](https://laragon.org/) (Windows) atau [XAMPP](https://www.apachefriends.org/) untuk mengelola PHP dan MySQL secara mudah.

---

## Panduan Instalasi Lengkap

### Langkah 1 — Clone Repository

Buka terminal/Command Prompt, lalu jalankan perintah berikut:

```bash
git clone https://github.com/FrankStein31/Sistem_Iuran_Internal_Perumahan.git
cd Sistem_Iuran_Internal_Perumahan
```

Struktur folder proyek:
```
Sistem_Iuran_Internal_Perumahan/
├── backend/            <- Laravel API
├── frontend/           <- React SPA
├── iuran_perumahan.sql <- File dump database (opsional)
└── README.md
```

---

### Langkah 2 — Konfigurasi Backend (Laravel)

#### 2.1 Masuk ke folder backend

```bash
cd backend
```

#### 2.2 Install dependensi PHP

```bash
composer install
```

> Proses ini membutuhkan waktu beberapa menit tergantung koneksi internet.

#### 2.3 Buat file konfigurasi `.env`

Salin file contoh konfigurasi:

```bash
# Linux / Mac
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

#### 2.4 Generate Application Key

```bash
php artisan key:generate
```

Output yang diharapkan:
```
INFO  Application key set successfully.
```

#### 2.5 Konfigurasi koneksi database di file `.env`

Buka file `backend/.env` dengan teks editor, lalu sesuaikan bagian berikut:

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=iuran_perumahan   # <- nama database yang akan dibuat
DB_USERNAME=root               # <- username MySQL Anda
DB_PASSWORD=                   # <- password MySQL Anda (kosong jika tidak ada)
```

---

### Langkah 3 — Setup Database

Terdapat **dua metode** untuk menyiapkan database. Pilih salah satu:

---

#### Metode A: Import File SQL (Direkomendasikan — Data Lengkap Siap Pakai)

Metode ini mengimpor **seluruh struktur tabel + data contoh** sekaligus:
- 20 Rumah (Blok A No. 1–20)
- 21 Data Penghuni (tetap & kontrak)
- Riwayat iuran 3 bulan (Feb–Apr 2026)
- 7 data pengeluaran
- 1 akun admin (`admin@rt.com`)

**Langkah A1 — Buat database baru di MySQL:**

Via MySQL CLI:
```bash
mysql -u root -p
```
```sql
CREATE DATABASE iuran_perumahan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

Via phpMyAdmin (`http://localhost/phpmyadmin`):
1. Klik **New** di sidebar kiri
2. Isi nama database: `iuran_perumahan`
3. Pilih collation: `utf8mb4_unicode_ci`
4. Klik **Create**

**Langkah A2 — Import file SQL:**

Via MySQL CLI (dari root folder proyek):
```bash
mysql -u root -p iuran_perumahan < iuran_perumahan.sql
```

Via phpMyAdmin:
1. Klik database `iuran_perumahan` di sidebar
2. Klik tab **Import** di menu atas
3. Klik **Choose File** lalu pilih file `iuran_perumahan.sql`
4. Klik tombol **Go / Import**
5. Tunggu hingga muncul pesan sukses hijau

**Langkah A3 — Update tabel migrasi Laravel agar sinkron:**

```bash
# Dari folder backend/
php artisan migrate --pretend
```

Jika tidak ada error merah, lanjut ke Langkah 4.
Jika ada tabel yang belum ada, jalankan:
```bash
php artisan migrate
```

---

#### Metode B: Migrasi + Seeder (Data Baru dari Laravel)

Metode ini membuat ulang semua tabel dan mengisi data dummy otomatis via Laravel Seeder.

> **Peringatan:** Perintah `migrate:fresh` akan **menghapus semua tabel & data** yang sudah ada, lalu membuat ulang dari awal.

**Langkah B1 — Buat database kosong terlebih dahulu** (sama seperti Metode A, Langkah A1).

**Langkah B2 — Jalankan fresh migration + seeder:**

```bash
# Dari folder backend/
php artisan migrate:fresh --seed
```

Proses ini akan otomatis:
- Membuat semua tabel database
- Mengisi data penghuni, rumah, iuran, dan pengeluaran dummy
- Membuat akun admin default

---

### Langkah 4 — Buat Storage Link (Wajib untuk Upload Foto KTP)

Perintah ini menghubungkan folder `storage/app/public` agar file yang diupload dapat diakses via URL publik:

```bash
# Dari folder backend/
php artisan storage:link
```

Output yang diharapkan:
```
INFO  The [public/storage] link has been connected to [storage/app/public].
```

> **Catatan Windows:**
>
> Jika muncul error:
> ```
> Cannot create a file when that file already exists.
> ```
> Berarti link sudah ada sebelumnya. Cukup lanjutkan ke langkah berikutnya.
>
> Jika foto tetap tidak muncul (link rusak/broken), jalankan perintah berikut di **PowerShell sebagai Administrator**:
> ```powershell
> Remove-Item -Path "public\storage" -Force -Recurse
> cmd /c mklink /J "public\storage" (Resolve-Path "storage\app\public").Path
> ```

---

### Langkah 5 — Jalankan Server Backend

```bash
# Dari folder backend/
php artisan serve
```

Output yang diharapkan:
```
INFO  Server running on [http://127.0.0.1:8000].

  Press Ctrl+C to stop the server
```

> **Biarkan terminal ini tetap terbuka.** Backend API aktif di `http://localhost:8000`.

---

### Langkah 6 — Konfigurasi & Jalankan Frontend (React)

Buka **terminal baru** (jangan tutup terminal backend).

#### 6.1 Masuk ke folder frontend

```bash
# Dari root proyek
cd frontend
```

#### 6.2 Install dependensi Node.js

```bash
npm install
```

> Proses ini memerlukan beberapa menit pertama kali. Selanjutnya akan lebih cepat karena cache.

#### 6.3 Verifikasi konfigurasi API (opsional)

File `frontend/src/api/axios.js` sudah dikonfigurasi untuk terhubung ke backend di port 8000:
```js
baseURL: 'http://localhost:8000/api'
```

Jika backend Anda berjalan di port berbeda, sesuaikan nilai ini.

#### 6.4 Jalankan development server

```bash
npm run dev
```

Output yang diharapkan:
```
  VITE v6.x.x  ready in xxx ms

  Local:   http://localhost:5173/
  Network: use --host to expose
```

---

### Langkah 7 — Akses Aplikasi

Buka browser dan akses: **[http://localhost:5173](http://localhost:5173)**

#### Kredensial Login Default

| Field | Value |
|---|---|
| **Email** | `admin@rt.com` |
| **Password** | `password` |

> Email, nama, dan password dapat diubah setelah login melalui menu **Profil Admin** di sidebar kiri (di atas tombol Logout).

---

## Quick Reference — Rangkuman Semua Perintah

```bash
# ===================== BACKEND =====================
cd backend
composer install

# Buat .env dari template
cp .env.example .env          # Linux/Mac
copy .env.example .env        # Windows CMD

# Edit .env: isi DB_DATABASE, DB_USERNAME, DB_PASSWORD

php artisan key:generate

# --- Pilih SALAH SATU metode database ---

# Metode A: Import SQL
mysql -u root -p iuran_perumahan < ../iuran_perumahan.sql

# Metode B: Fresh migrate + seeder
php artisan migrate:fresh --seed

# --- Wajib dijalankan ---
php artisan storage:link
php artisan serve

# ==================== FRONTEND ====================
# (Buka terminal baru)
cd frontend
npm install
npm run dev
```

---

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    users {
        bigint id PK
        string name
        string email UK
        string password
    }

    residents {
        bigint id PK
        string nama_lengkap
        string no_ktp UK
        string foto_ktp
        enum status_penghuni "tetap, kontrak"
        string no_hp
        enum status_nikah "menikah, belum_menikah"
    }

    houses {
        bigint id PK
        string nomor_rumah UK
        string alamat
        enum status_hunian "dihuni, tidak_dihuni"
        bigint current_resident_id FK
    }

    house_residents {
        bigint id PK
        bigint house_id FK
        bigint resident_id FK
        date tanggal_masuk
        date tanggal_keluar
        boolean is_active
    }

    payments {
        bigint id PK
        bigint house_id FK
        bigint resident_id FK
        enum jenis_iuran "satpam, kebersihan"
        int bulan
        year tahun
        decimal jumlah
        enum status "paid, unpaid"
        date tanggal_bayar
    }

    expenses {
        bigint id PK
        date tanggal
        string deskripsi
        decimal jumlah
        string kategori
    }

    houses ||--o| residents : "Ditempati saat ini"
    houses ||--o{ house_residents : "Memiliki history penghuni"
    residents ||--o{ house_residents : "Memiliki history rumah"
    houses ||--o{ payments : "Memiliki tagihan bulanan"
    residents ||--o{ payments : "Bertanggung jawab atas tagihan"
```

---

## Troubleshooting

| Masalah | Kemungkinan Penyebab | Solusi |
|---|---|---|
| `php artisan serve` error | PHP tidak ditemukan di PATH | Install PHP 8.3+, tambahkan ke PATH |
| `composer install` gagal | Composer belum terpasang | Install Composer dari [getcomposer.org](https://getcomposer.org) |
| `npm install` gagal | Node.js belum terpasang | Install Node.js 18+ dari [nodejs.org](https://nodejs.org) |
| Error koneksi database | Konfigurasi `.env` salah | Cek `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`; pastikan MySQL berjalan |
| Foto KTP tidak muncul | Storage link tidak terbentuk / rusak | Jalankan ulang `php artisan storage:link` atau buat manual via PowerShell Admin |
| Halaman putih/blank | Frontend tidak terhubung ke backend | Pastikan `php artisan serve` aktif di port 8000 |
| Login gagal (401 Unauthorized) | Tabel `users` kosong | Import `iuran_perumahan.sql` atau jalankan `php artisan migrate:fresh --seed` |
| Port 8000 sudah dipakai | Proses lain menggunakan port tersebut | Gunakan `php artisan serve --port=8001` dan update `baseURL` di `frontend/src/api/axios.js` |
| Foto error `ERR_CONNECTION_REFUSED` | Vite proxy menuju IPv6 | Pastikan target proxy di `vite.config.js` menggunakan `http://127.0.0.1:8000` bukan `localhost` |

---

## Pengembang

Dikembangkan oleh **Frankie Steinlie**
