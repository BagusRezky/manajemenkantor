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
        Schema::create('bon_pays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_invoice')->constrained('invoices')->onDelete('cascade');
            $table->foreignId('id_metode_bayar')->constrained('metode_bayars')->onDelete('cascade');
            $table->foreignId('id_account')->nullable()->constrained('master_coas')->nullOnDelete();
            $table->foreignId('id_karyawan')->nullable()->constrained('karyawans')->nullOnDelete();
            $table->string('nomor_pembayaran')->nullable();
            $table->decimal('nominal_pembayaran', 15, 2)->default(0);
            $table->string('gudang')->nullable();
            $table->string('keterangan')->nullable();
            $table->date('tanggal_pembayaran');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bon_pays');
    }
};
