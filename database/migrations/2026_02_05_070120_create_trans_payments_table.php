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
        Schema::create('trans_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_po_billing')->constrained('po_billings')->onDelete('cascade');
            $table->foreignId('id_karyawan')->nullable()->constrained('karyawans')->onDelete('cascade');
            $table->string('no_pembayaran')->unique();
            $table->date('tanggal_header')->nullable();
            $table->string('gudang');
            $table->string('periode');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trans_payments');
    }
};
