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
        Schema::create('finishings', function (Blueprint $table) {
            $table->id();
            $table->string('kode_finishing');
            $table->foreignId('id_kartu_instruksi_kerja')->constrained('kartu_instruksi_kerjas')->onDelete('cascade');
            $table->foreignId('id_mesin_finishing')->constrained('mesin_finishings')->onDelete('cascade');
            $table->foreignId('id_operator_finishing')->constrained('operator_finishings')->onDelete('cascade');
            $table->date('tanggal_entri');
            $table->string('proses_finishing');
            $table->string('tahap_finishing');
            $table->integer('hasil_baik_finishing');
            $table->integer('hasil_rusak_finishing');
            $table->integer('semi_waste_finishing');
            $table->string('keterangan_finishing');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finishings');
    }
};
