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
        Schema::create('retur_eksternals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_penerimaan_barang')->constrained('penerimaan_barangs')->onDelete('cascade');
            $table->string('no_retur')->unique(); // ✅ TAMBAH: Auto-generated nomor retur
            $table->date('tgl_retur_barang');
            $table->string('nama_retur');
            $table->text('catatan_retur')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retur_eksternals');
    }
};
