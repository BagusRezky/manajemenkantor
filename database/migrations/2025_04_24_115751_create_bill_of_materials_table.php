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
        Schema::create('bill_of_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_finish_good_item')->constrained('finish_good_items')->onDelete('cascade');
            $table->foreignId('id_master_item')->constrained('master_items')->onDelete('cascade');
            $table->foreignId('id_departemen')->constrained('departemens')->onDelete('cascade');
            $table->string('waste')->nullable();
            $table->string('qty')->nullable();
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bill_of_materials');
    }
};
