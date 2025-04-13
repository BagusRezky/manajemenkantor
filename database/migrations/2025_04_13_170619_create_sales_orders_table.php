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
        Schema::create('sales_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_customer_address')->constrained('customer_addresses')->onDelete('cascade');
            $table->foreignId('id_finish_good_item')->constrained('finish_good_items')->onDelete('cascade');
            $table->string('no_bon_pesanan');
            $table->string('no_po_customer');
            $table->string('jumlah_pesanan');
            $table->string('harga_pcs_bp');
            $table->string('harga_pcs_kirim');
            $table->string('mata_uang');
            $table->string('syarat_pembayaran');
            $table->string('eta_marketing');
            $table->string('klaim_kertas');
            $table->string('dipesan_via');
            $table->string('tipe_pesanan');
            $table->string('toleransi_pengiriman')->nullable();
            $table->string('catatan_colour_range')->nullable();
            $table->string('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_orders');
    }
};
