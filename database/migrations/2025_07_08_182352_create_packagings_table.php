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
        Schema::create('packagings', function (Blueprint $table) {
            $table->id();
            $table->string('kode_packaging');
            $table->foreignId('id_kartu_instruksi_kerja')->constrained('kartu_instruksi_kerjas')->onDelete('cascade');
            $table->string('satuan_transfer');
            $table->string('jenis_transfer');
            $table->date('tgl_transfer');
            $table->integer('jumlah_satuan_penuh');
            $table->integer('qty_persatuan_penuh');
            $table->integer('jumlah_satuan_sisa');
            $table->integer('qty_persatuan_sisa');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packagings');
    }
};
