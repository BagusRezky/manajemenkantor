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
        Schema::create('imr_diemaking_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_imr_diemaking')->constrained('imr_diemakings')->onDelete('cascade');
            $table->foreignId('id_kartu_instruksi_kerja_bom')->constrained('kartu_instruksi_kerja_boms')->onDelete('cascade');
            $table->decimal('qty_request', 10, 2)->default(0);
            $table->decimal('qty_approved', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imr_diemaking_items');
    }
};
