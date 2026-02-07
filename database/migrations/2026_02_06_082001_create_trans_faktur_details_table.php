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
        Schema::create('trans_faktur_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_trans_faktur')->constrained('trans_fakturs')->onDelete('cascade');
            $table->string('master_item');
            $table->decimal('qty', 15, 2)->default(0);
            $table->decimal('harga_per_qty', 15, 2)->default(0);
            $table->string('unit')->nullable();
            $table->decimal('discount', 15, 2)->nullable();

            // Breakdown per item
            $table->decimal('subtotal', 15, 2)->default(0); // qty * harga
            $table->decimal('ppn_persen', 5, 2)->default(0); //
            $table->decimal('ppn_nilai', 15, 2)->default(0);
            $table->decimal('total_item', 15, 2)->default(0); // subtotal + ppn_nilai


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trans_faktur_details');
    }
};
