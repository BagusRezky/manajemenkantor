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
        Schema::create('subcount_outs', function (Blueprint $table) {
            $table->id();
            $table->string('no_subcount_out');
            $table->date('tgl_subcount_out');
            $table->foreignId('id_supplier')->constrained('suppliers')->onDelete('cascade');
            $table->string('admin_produksi');
            $table->string('supervisor');
            $table->string('admin_mainstore');
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subcount_outs');
    }
};
