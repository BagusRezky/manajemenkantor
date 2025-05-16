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
        Schema::create('penerimaan_barangs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_purchase_order')->constrained('purchase_orders')->onDelete('cascade');
            $table->string('no_laporan_barang')->unique();
            $table->string('no_surat_jalan')->nullable();
            $table->date('tgl_terima_barang')->nullable();
            $table->string('nopol_kendaraan')->nullable();
            $table->string('nama_pengirim')->nullable();
            $table->text('catatan_pengirim')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penerimaan_barangs');
    }
};
