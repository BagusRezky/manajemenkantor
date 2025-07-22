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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_surat_jalan')
                ->constrained('surat_jalans')
                ->onDelete('cascade');
            $table->string('no_invoice');
            $table->date('tgl_invoice');
            $table->date('tgl_jatuh_tempo');
            $table->integer('harga')->default(0);
            $table->decimal('ppn', 10, 2);
            $table->integer('ongkos_kirim')->default(0);
            $table->integer('uang_muka')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
