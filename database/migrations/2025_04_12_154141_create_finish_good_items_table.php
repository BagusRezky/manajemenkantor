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
        Schema::create('finish_good_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_customer_address')->constrained('customer_addresses')->onDelete('cascade');
            $table->foreignId('id_type_item')->constrained('type_items')->onDelete('cascade');
            $table->foreignId('satuan_satu_id')->constrained('units')->onDelete('cascade');
            $table->string('kode_material_produk');
            $table->string('kode_barcode');
            $table->string('pc_number');
            $table->string('nama_barang');
            $table->string('deskripsi');
            $table->string('spesifikasi_kertas');
            $table->string('up_satu');
            $table->string('up_dua');
            $table->string('up_tiga');
            $table->string('ukuran_potong');
            $table->string('ukuran_cetak');
            $table->decimal('panjang', 10, 2);
            $table->decimal('lebar', 10, 2);
            $table->decimal('tinggi', 10, 2);
            $table->decimal('berat_kotor', 10, 2);
            $table->decimal('berat_bersih', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finish_good_items');
    }
};
