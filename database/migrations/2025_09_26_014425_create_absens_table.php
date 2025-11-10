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
        Schema::create('absens', function (Blueprint $table) {
            $table->id();
            $table->timestamp('tanggal_scan')->nullable(); // gabungan tanggal + jam
            $table->date('tanggal')->nullable();
            $table->time('jam')->nullable();
            $table->string('pin')->nullable();
            $table->string('nip')->nullable();
            $table->string('nama')->nullable();
            $table->string('jabatan')->nullable();
            $table->string('departemen')->nullable();
            $table->string('kantor')->nullable();
            $table->string('verifikasi')->nullable();
            $table->string('io')->nullable();
            $table->string('workcode')->nullable();
            $table->string('sn')->nullable();
            $table->string('mesin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absens');
    }
};
