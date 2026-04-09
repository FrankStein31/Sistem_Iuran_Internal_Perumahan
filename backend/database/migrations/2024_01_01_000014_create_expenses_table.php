<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->string('deskripsi');
            $table->decimal('jumlah', 12, 2);
            $table->string('kategori')->default('umum'); // listrik, perbaikan_jalan, perbaikan_selokan, gaji_satpam, umum
            $table->string('bukti')->nullable(); // foto bukti transaksi
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
