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
        Schema::create('master_items', function (Blueprint $table) {
            $table->id();
            $table->string('kode_master_item')->unique();
            $table->foreignId('satuan_satu_id')->constrained('units')->onDelete('cascade');
            $table->foreignId('id_category_item')->constrained('category_items')->onDelete('cascade');
            $table->foreignId('id_type_item')->constrained('type_items')->onDelete('cascade');
            $table->decimal('qty', 10, 2)->nullable();
            $table->decimal('panjang', 10, 2)->nullable();
            $table->decimal('lebar', 10, 2)->nullable();
            $table->decimal('tinggi', 10, 2)->nullable();
            $table->decimal('berat', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_items');
    }
};
