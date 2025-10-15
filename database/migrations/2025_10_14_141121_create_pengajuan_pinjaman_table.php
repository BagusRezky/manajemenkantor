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
        Schema::create('pengajuan_pinjaman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_karyawan')->constrained('karyawans')->onDelete('cascade');
            $table->string('kode_gudang');
            $table->string('nomor_bukti_pengajuan');
            $table->date('tanggal_pengajuan');
            $table->integer('nilai_pinjaman');
            $table->integer('jangka_waktu_pinjaman');
            $table->integer('cicilan_per_bulan');
            $table->string('keperluan_pinjaman')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengajuan_pinjamen');
    }
};
