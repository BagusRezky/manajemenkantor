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
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_purchase_order')->constrained('purchase_orders')->onDelete('cascade');
            $table->foreignId('id_purchase_request_item')->constrained('purchase_request_items')->onDelete('cascade');
            $table->foreignId('id_master_item')->constrained('master_items')->onDelete('cascade');
            $table->foreignId('id_satuan_po')->constrained('units')->onDelete('cascade');
            $table->decimal('qty_po', 10, 2);
            $table->decimal('harga_satuan', 15, 2);
            $table->decimal('diskon_satuan', 15, 2);
            $table->decimal('jumlah', 15, 2);
            $table->text('remark_item_po')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
    }
};
