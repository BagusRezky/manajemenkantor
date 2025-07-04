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
        Schema::create('printings', function (Blueprint $table) {
            $table->id();
            $table->string('kode_printing');
            $table->foreignId('id_kartu_instruksi_kerja')->constrained('kartu_instruksi_kerjas')->onDelete('cascade');
            $table->foreignId('id_mesin')->constrained('mesins')->onDelete('cascade');
            $table->foreignId('id_operator')->constrained('operators')->onDelete('cascade');
            $table->date('tanggal_entri');
            $table->string('proses_printing');
            $table->string('tahap_printing');
            $table->integer('hasil_baik_printing');
            $table->integer('hasil_rusak_printing');
            $table->integer('semi_waste_printing');
            $table->string('keterangan_printing')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('printings');
    }
};
