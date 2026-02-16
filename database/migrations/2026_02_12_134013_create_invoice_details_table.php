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
        Schema::create('invoice_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_invoice')->constrained('invoices')->onDelete('cascade');
            $table->foreignId('id_account')->nullable()->constrained('master_coas')->nullOnDelete();
            $table->string('kode_group')->nullable();
            $table->string('kode_produk')->nullable();
            $table->string('nama_produk')->nullable();
            $table->decimal('jumlah', 15, 2)->default(0)->nullable();
            $table->decimal('harga', 15, 2)->default(0)->nullable();
            $table->decimal('diskon_barang', 15, 2)->default(0)->nullable();
            $table->decimal('diskon_member', 15, 2)->default(0)->nullable();
            $table->decimal('bayar', 15, 2)->default(0)->nullable();
            $table->decimal('kembali', 15, 2)->default(0)->nullable();
            $table->decimal('total', 15, 2)->default(0)->nullable();
            $table->string('unit')->nullable();
            $table->string('marketing')->nullable();
            $table->decimal('qty_small', 15, 2)->default(0)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_details');
    }
};
