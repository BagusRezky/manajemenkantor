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
        Schema::create('kartu_instruksi_kerja_boms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_kartu_instruksi_kerja')->constrained('kartu_instruksi_kerjas')->onDelete('cascade');
            $table->foreignId('id_bom')->constrained('bill_of_materials')->onDelete('cascade');
            $table->decimal('waste', 20, 2); // Nilai waste yang bisa diedit
            $table->integer('total_kebutuhan'); // Total kebutuhan material
            $table->integer('jumlah_sheet_cetak')->nullable(); // Hasil perhitungan untuk sheet
            $table->integer('jumlah_total_sheet_cetak')->nullable(); // Jumlah sheet + waste
            $table->integer('jumlah_produksi')->nullable(); // Nilai produksi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kartu_instruksi_kerja_boms');
    }
};
