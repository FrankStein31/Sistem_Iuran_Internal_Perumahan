<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained()->onDelete('cascade');
            $table->foreignId('resident_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('jenis_iuran', ['satpam', 'kebersihan']);
            $table->tinyInteger('bulan'); // 1-12
            $table->year('tahun');
            $table->decimal('jumlah', 12, 2);
            $table->enum('status', ['paid', 'unpaid'])->default('unpaid');
            $table->date('tanggal_bayar')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();

            // Unique: one payment record per house, type, month, year
            $table->unique(['house_id', 'jenis_iuran', 'bulan', 'tahun'], 'unique_payment');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
