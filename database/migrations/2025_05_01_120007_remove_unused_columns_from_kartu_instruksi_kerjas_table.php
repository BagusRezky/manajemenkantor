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
        Schema::table('kartu_instruksi_kerjas', function (Blueprint $table) {
            $table->dropColumn([
                'up_satu',
                'up_dua',
                'up_tiga',
                'ukuran_potong',
                'ukuran_cetak',
                'spesifikasi_kertas',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kartu_instruksi_kerjas', function (Blueprint $table) {
            $table->integer('up_satu')->nullable();
            $table->integer('up_dua')->nullable();
            $table->integer('up_tiga')->nullable();
            $table->string('ukuran_potong')->nullable();
            $table->string('ukuran_cetak')->nullable();
            $table->string('spesifikasi_kertas')->nullable();
        });
    }
};
