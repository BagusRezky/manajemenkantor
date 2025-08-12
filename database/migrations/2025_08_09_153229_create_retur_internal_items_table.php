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
        Schema::create('retur_internal_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_retur_internal')->constrained('retur_internals')->onDelete('cascade');
            $table->foreignId('id_imr_item')->nullable()->constrained('imr_items')->onDelete('cascade');
            $table->foreignId('id_imr_diemaking_item')->nullable()->constrained('imr_diemaking_items')->onDelete('cascade');
            $table->foreignId('id_imr_finishing_item')->nullable()->constrained('imr_finishing_items')->onDelete('cascade');
            $table->decimal('qty_approved_retur', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retur_internal_items');
    }
};
