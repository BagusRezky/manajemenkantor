<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('potongan_tunjangans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_karyawan')->constrained('karyawans')->onDelete('cascade');
            $table->date('periode_payroll');
            $table->integer('potongan_tunjangan_jabatan');
            $table->integer('potongan_tunjangan_kompetensi');
            $table->integer('potongan_intensif');
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('potongan_tunjangans');
    }
};
