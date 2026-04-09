<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('houses', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_rumah', 10)->unique();
            $table->string('alamat');
            $table->enum('status_hunian', ['dihuni', 'tidak_dihuni'])->default('tidak_dihuni');
            $table->unsignedBigInteger('current_resident_id')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('houses');
    }
};
