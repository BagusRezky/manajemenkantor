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
        Schema::table('karyawans', function (Blueprint $table) {
            $table->string('nik')->nullable();
            $table->string('no_ktp')->nullable();
            $table->string('jenis_kelamin')->nullable();
            $table->string('status_perkawinan')->nullable();
            $table->string('agama')->nullable();
            $table->text('keterangan_tambahan')->nullable();

            $table->text('alamat_domisili')->nullable();
            $table->string('kota_domisili')->nullable();
            $table->string('kecamatan_domisili')->nullable();
            $table->string('desa_domisili')->nullable();
            $table->string('kode_pos_domisili')->nullable();

            // Alamat KTP
            $table->text('alamat_ktp')->nullable();
            $table->string('kota_ktp')->nullable();
            $table->string('kecamatan_ktp')->nullable();
            $table->string('desa_ktp')->nullable();
            $table->string('kode_pos_ktp')->nullable();

            $table->integer('gaji_pokok')->nullable();
            $table->string('tipe_gaji')->nullable();
            $table->string('nama_npwp')->nullable();
            $table->text('alamat_npwp')->nullable();
            $table->string('nama_bank')->nullable();
            $table->string('rekening_an')->nullable();
            $table->string('nomor_rekening')->nullable();
            $table->string('ptkp')->nullable();
            $table->integer('tunjangan_kompetensi')->nullable();
            $table->integer('tunjangan_jabatan')->nullable();
            $table->integer('tunjangan_intensif')->nullable();
            $table->date('tanggal_npwp')->nullable();
            $table->string('nomor_npwp')->nullable();

            $table->string('bpjs_nama')->nullable();
            $table->string('bpjs_kesehatan')->nullable();
            $table->string('bpjs_ketenagakerjaan')->nullable();
            $table->string('bpjs_cabang')->nullable();
            $table->date('bpjs_tanggal')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('karyawans', function (Blueprint $table) {
           $table->dropColumn([
                'nik', 'no_ktp', 'jenis_kelamin', 'status_perkawinan', 'agama', 'keterangan_tambahan',
                'alamat_domisili', 'kota_domisili', 'kecamatan_domisili', 'desa_domisili', 'kode_pos_domisili',
                'alamat_ktp', 'kota_ktp', 'kecamatan_ktp', 'desa_ktp', 'kode_pos_ktp',
                'gaji_pokok', 'tipe_gaji', 'nama_npwp', 'alamat_npwp', 'nama_bank',
                'rekening_an', 'nomor_rekening', 'ptkp', 'tunjangan_kompetensi',
                'tunjangan_jabatan', 'tunjangan_intensif', 'tanggal_npwp', 'nomor_npwp',
                'bpjs_nama', 'bpjs_kesehatan', 'bpjs_ketenagakerjaan', 'bpjs_cabang', 'bpjs_tanggal'
            ]);
        });
    }
};
