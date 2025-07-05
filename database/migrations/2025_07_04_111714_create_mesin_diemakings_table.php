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
        Schema::create('mesin_diemakings', function (Blueprint $table) {
            $table->id();
            $table->string('nama_mesin_diemaking');
            $table->string('jenis_mesin_diemaking');
            $table->string('kapasitas_diemaking');
            $table->string('proses_diemaking');
            $table->string('status_diemaking');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mesin_diemakings');
    }
};
