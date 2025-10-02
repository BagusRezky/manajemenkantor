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
        Schema::create('karyawans', function (Blueprint $table) {
            $table->id();
            $table->string('pin')->nullable();
            $table->string('nip')->nullable();
            $table->string('nama')->nullable();
            $table->string('jadwal_kerja')->nullable();
            $table->date('tgl_mulai_jadwal')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('jabatan')->nullable();
            $table->string('departemen')->nullable();
            $table->string('kantor')->nullable();
            $table->string('password')->nullable();
            $table->string('rfid')->nullable();
            $table->string('no_telp')->nullable();
            $table->string('privilege')->nullable();
            $table->string('status_pegawai')->default('Aktif');

            // biometrik
            $table->integer('fp_zk')->nullable();
            $table->integer('fp_neo')->nullable();
            $table->integer('fp_revo')->nullable();
            $table->integer('fp_livo')->nullable();
            $table->integer('fp_uareu')->nullable();
            $table->integer('wajah')->nullable();
            $table->integer('telapak_tangan')->nullable();
            $table->date('tgl_masuk_kerja')->nullable();
            $table->date('tgl_akhir_kontrak')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('karyawans');
    }
};
