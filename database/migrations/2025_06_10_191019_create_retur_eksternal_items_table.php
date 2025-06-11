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
        Schema::create('retur_eksternal_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_retur_eksternal')->constrained('retur_eksternals')->onDelete('cascade');
            $table->foreignId('id_penerimaan_barang_item')->constrained('penerimaan_barang_items')->onDelete('cascade');
            $table->decimal('qty_retur', 10, 2);
            $table->text('catatan_retur_item')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retur_eksternal_items');
    }
};
