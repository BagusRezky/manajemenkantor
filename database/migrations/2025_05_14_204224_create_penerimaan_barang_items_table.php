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
        Schema::create('penerimaan_barang_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_penerimaan_barang')->constrained('penerimaan_barangs')->onDelete('cascade');
            $table->foreignId('id_purchase_order_item')->constrained('purchase_order_items')->onDelete('cascade');
            $table->integer('qty_penerimaan');
            $table->text('catatan_item')->nullable();
            $table->date('tgl_expired')->nullable();
            $table->string('no_delivery_order')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penerimaan_barang_items');
    }
};
