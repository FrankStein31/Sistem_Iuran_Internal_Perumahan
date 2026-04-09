<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap');
            $table->string('no_ktp', 16)->unique();
            $table->string('foto_ktp')->nullable();
            $table->enum('status_penghuni', ['tetap', 'kontrak'])->default('tetap');
            $table->string('no_hp', 20);
            $table->enum('status_nikah', ['menikah', 'belum_menikah'])->default('belum_menikah');
            $table->text('catatan')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
