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
        Schema::create('mesin_finishings', function (Blueprint $table) {
            $table->id();
            $table->string('nama_mesin_finishing');
            $table->string('jenis_mesin_finishing');
            $table->string('kapasitas_finishing');
            $table->string('proses_finishing');
            $table->string('status_finishing');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mesin_finishings');
    }
};
