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
        Schema::create('pembayaran_pinjamans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pengajuan_pinjaman')->constrained('pengajuan_pinjamans')->onDelete('cascade');
            $table->string('no_bukti_pembayaran');
            $table->date('tanggal_pembayaran');
            $table->integer('nominal_pembayaran');
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran_pinjamans');
    }
};
