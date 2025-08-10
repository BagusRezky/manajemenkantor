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
        Schema::create('subcount_in_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_subcount_in')->constrained('subcount_ins')->onDelete('cascade');
            $table->foreignId('id_subcount_out')->constrained('subcount_outs')->onDelete('cascade');
            $table->integer('qty')->nullable();
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subcount_in_items');
    }
};
