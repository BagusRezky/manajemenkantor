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
        Schema::table('pembayaran_pinjamans', function (Blueprint $table) {
            $table->renameColumn('no_bukti_pembayaran', 'tahap_cicilan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pembayaran_pinjamans', function (Blueprint $table) {
            $table->renameColumn('tahap_cicilan', 'no_bukti_pembayaran');
        });
    }
};
