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
        Schema::create('retur_internals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_imr_finishing')->nullable()->constrained('imr_finishings')->onDelete('cascade');
            $table->foreignId('id_imr_diemaking')->nullable()->constrained('imr_diemakings')->onDelete('cascade');
            $table->foreignId('id_imr')->nullable()->constrained('imrs')->onDelete('cascade');
            $table->string('no_retur_internal')->unique();
            $table->date('tgl_retur_internal');
            $table->string('nama_retur_internal');
            $table->string('catatan_retur_internal')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retur_internals');
    }
};
