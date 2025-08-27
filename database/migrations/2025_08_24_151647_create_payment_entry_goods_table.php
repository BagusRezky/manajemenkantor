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
        Schema::create('payment_entry_goods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_penerimaan_barang')->constrained('penerimaan_barangs')->onDelete('cascade');
            $table->string('no_tagihan')->unique();
            $table->date('tanggal_transaksi');
            $table->date('tanggal_jatuh_tempo');
            $table->decimal('harga_per_qty', 10, 2)->default(0);
            $table->decimal('diskon', 10, 2)->default(0);
            $table->decimal('ppn', 10, 2)->default(0);
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_entry_goods');
    }
};
