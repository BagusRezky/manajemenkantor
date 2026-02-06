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
        Schema::create('trans_fakturs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_purchase_order')->nullable()->constrained('purchase_orders')->onDelete('cascade');
            $table->string('no_po_asal')->nullable(); // Data legacy
            $table->string('no_faktur')->nullable(); // ID unik dari Excel (misal: 4.00E+15 atau nomor asli)
            $table->string('no_invoice')->nullable();
            $table->date('tanggal_transaksi')->nullable();
            $table->integer('periode')->nullable();
            $table->string('gudang')->nullable();

            // Data Vendor/Customer Legacy
            $table->string('kode_customer')->nullable();
            $table->string('npwp')->nullable();
            $table->text('alamat')->nullable();
            $table->string('keterangan')->nullable();
            $table->foreignId('id_karyawan')->nullable()->constrained('karyawans')->onDelete('set null');

            // Finansial Header (Penting untuk Akuntansi/Jurnal)
            $table->decimal('total_dpp', 15, 2)->default(0);
            $table->decimal('total_ppn', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trans_fakturs');
    }
};
