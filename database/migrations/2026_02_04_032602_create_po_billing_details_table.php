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
        Schema::create('po_billing_details', function (Blueprint $table) {
            $table->id();
            // Relasi ke Header Billing
            $table->foreignId('id_po_billing')->constrained('po_billings')->onDelete('cascade');

            // Relasi ke Item Penerimaan Barang (Agar sinkron dengan Qty Terima)
            $table->foreignId('id_penerimaan_barang_item')->nullable()->constrained('penerimaan_barang_items')->onDelete('cascade');

            // Data Item (Fallback jika relasi null saat migrasi)
            $table->string('master_item');
            $table->decimal('qty', 15, 2)->default(0);
            $table->decimal('harga_per_qty', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);

            // LEGACY COLUMN
            // dipakai HANYA untuk data hasil migrasi
            // JANGAN dipakai untuk logic billing baru
            $table->decimal('total', 15, 2)->default(0)->nullable();
            $table->decimal('ppn', 15, 2)->default(0)->nullable();
            $table->decimal('total_semua', 15, 2)->default(0)->nullable();

            // Satuan
            $table->string('unit')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('po_billing_details');
    }
};
