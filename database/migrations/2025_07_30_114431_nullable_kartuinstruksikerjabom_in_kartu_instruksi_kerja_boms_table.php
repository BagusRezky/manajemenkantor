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
        Schema::table('kartu_instruksi_kerja_boms', function (Blueprint $table) {
            // $table->foreignId('id_kartu_instruksi_kerja')->nullable()->change();
            $table->foreignId('id_bom')->nullable()->change();
            $table->decimal('waste', 20, 2)->nullable()->change();
            $table->integer('total_kebutuhan')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kartu_instruksi_kerja_boms', function (Blueprint $table) {
            // $table->foreignId('id_kartu_instruksi_kerja')->nullable(false)->change();
            $table->foreignId('id_bom')->nullable(false)->change();
            $table->decimal('waste', 20, 2)->nullable(false)->change();
            $table->integer('total_kebutuhan')->nullable(false)->change();
        });
    }
};
