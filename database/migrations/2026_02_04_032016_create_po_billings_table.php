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
        Schema::create('po_billings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_penerimaan_barang')->nullable()->constrained('penerimaan_barangs')->onDelete('cascade');
            $table->foreignId('id_karyawan')->nullable()->constrained('karyawans')->onDelete('cascade');

            // Relasi ke Purchase Order (untuk backup/memudahkan pencarian)
            $table->foreignId('id_purchase_order')->nullable()->constrained('purchase_orders')->onDelete('cascade');
            $table->string('no_po_asal')->nullable();

            // Kolom Identitas Tagihan
            $table->string('no_bukti_tagihan')->unique(); // Contoh: 085/BILL-IK01/I/26
            $table->string('invoice_vendor')->nullable(); // Nomor invoice fisik dari supplier

            // Data Transaksi
            $table->string('gudang');
            $table->integer('periode');
            $table->date('tanggal_transaksi')->nullable();
            $table->date('jatuh_tempo')->nullable();

            // Finansial
            $table->decimal('ongkir', 15, 2)->default(0);
            $table->decimal('total_nilai_barang', 15, 2)->default(0)->nullable();
            $table->decimal('ppn', 15, 2)->default(0)->nullable();
            $table->decimal('dp', 15, 2)->default(0)->nullable();
            $table->decimal('total_akhir', 15, 2)->default(0)->nullable();
            $table->string('keterangan')->nullable();

            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('po_billings');
    }
};
