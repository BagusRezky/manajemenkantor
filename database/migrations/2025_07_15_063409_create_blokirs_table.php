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
        Schema::create('blokirs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_kartu_instruksi_kerja')->constrained('kartu_instruksi_kerjas')->onDelete('cascade');
            $table->string('no_blokir');
            $table->datetime('tgl_blokir');
            $table->string('operator');
            $table->integer('qty_blokir');
            $table->string('keterangan_blokir')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blokirs');
    }
};
