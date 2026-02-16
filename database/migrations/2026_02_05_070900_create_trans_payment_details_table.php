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
        Schema::create('trans_payment_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_trans_payment')->constrained('trans_payments')->onDelete('cascade');
            $table->foreignId('id_metode_bayar')->nullable()->constrained('metode_bayars')->onDelete('cascade');
            $table->foreignId('id_account_debit')->nullable()->constrained('master_coas')->onDelete('cascade');
            $table->foreignId('id_account_kredit')->nullable()->constrained('master_coas')->onDelete('cascade');
            $table->date('tanggal_pembayaran')->nullable();
            $table->string('curs')->nullable();
            $table->string('bank')->nullable();
            $table->string('an_rekening')->nullable();
            $table->string('no_rekening')->nullable();
            $table->decimal('nominal', 15, 2)->nullable()->default(0);
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trans_payment_details');
    }
};
