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
        Schema::create('master_coa_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_karyawan')->constrained('karyawans')->onDelete('cascade');
            $table->string('code');
            $table->string('name');
            $table->boolean('status')
                ->default(1)
                ->comment('1 = active, 0 = inactive');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_coa_classes');
    }
};
