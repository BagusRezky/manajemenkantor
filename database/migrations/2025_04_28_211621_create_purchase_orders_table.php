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
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_purchase_request')->constrained('purchase_requests')->onDelete('cascade');
            $table->foreignId('id_supplier')->constrained('suppliers')->onDelete('cascade');
            $table->string('no_po');
            $table->date('tanggal_po');
            $table->date('eta');
            $table->string('mata_uang');
            $table->decimal('ppn', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
