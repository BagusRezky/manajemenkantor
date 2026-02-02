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
        Schema::create('master_coas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_karyawan')->nullable()->constrained('karyawans')->onDelete('cascade');
            $table->foreignId('id_master_coa_class')->nullable()->constrained('master_coa_classes')->onDelete('cascade');
            $table->integer('periode');
            $table->string('gudang');
            $table->string('kode_akuntansi');
            $table->string('nama_akun');
            $table->decimal('saldo_debit', 15, 2)->default(0);
            $table->decimal('saldo_kredit', 15, 2)->default(0);
            $table->decimal('nominal_default', 15, 2)->default(0);
            $table->string('keterangan')->nullable();
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
        Schema::dropIfExists('master_coas');
    }
};
