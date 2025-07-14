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
        Schema::dropIfExists('die_makings');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('die_makings', function (Blueprint $table) {
            $table->id();
            $table->string('kode_diemaking')->unique();
            $table->foreignId('id_kartu_instruksi_kerja')->constrained('kartu_instruksi_kerjas')->onDelete('cascade');
            $table->foreignId('id_mesin')->constrained('mesins')->onDelete('cascade');
            $table->foreignId('id_operator')->constrained('operators')->onDelete('cascade');
            $table->date('tanggal_entri');
            $table->string('proses_diemaking');
            $table->string('tahap_diemaking');
            $table->integer('hasil_baik_diemaking');
            $table->integer('hasil_rusak_diemaking');
            $table->integer('semi_waste_diemaking');
            $table->string('keterangan_diemaking');
            $table->timestamps();
        });
    }
};
