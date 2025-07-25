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
        Schema::create('surat_jalans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_kartu_instruksi_kerja')
                ->constrained('kartu_instruksi_kerjas')
                ->onDelete('cascade');
            $table->string('no_surat_jalan');
            $table->date('tgl_surat_jalan');
            $table->string('transportasi');
            $table->string('no_polisi');
            $table->string('driver');
            $table->string('pengirim');
            $table->string('keterangan');
            $table->string('alamat_tujuan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_jalans');
    }
};
