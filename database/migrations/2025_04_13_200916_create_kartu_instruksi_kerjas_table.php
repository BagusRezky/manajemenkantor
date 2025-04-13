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
        Schema::create('kartu_instruksi_kerjas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_sales_order')->constrained('sales_orders')->onDelete('cascade');
            $table->string('no_kartu_instruksi_kerja')->unique();
            $table->string('production_plan');
            $table->date('tgl_estimasi_selesai');
            $table->string('spesifikasi_kertas')->nullable();
            $table->integer('up_satu')->nullable();
            $table->integer('up_dua')->nullable();
            $table->integer('up_tiga')->nullable();
            $table->string('ukuran_potong')->nullable();
            $table->string('ukuran_cetak')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kartu_instruksi_kerjas');
    }
};
