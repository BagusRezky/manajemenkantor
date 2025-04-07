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
        Schema::create('master_konversis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_type_item')->constrained('type_items')->onDelete('cascade');
            $table->foreignId('satuan_satu_id')->constrained('units')->onDelete('cascade');
            $table->foreignId('satuan_dua_id')->constrained('units')->onDelete('cascade');
            $table->string('jumlah_satuan_konversi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_konversis');
    }
};
