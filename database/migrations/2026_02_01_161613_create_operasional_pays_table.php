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
        Schema::create('operasional_pays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_karyawan')->nullable()->constrained('karyawans')->onDelete('cascade');
            $table->foreignId('id_account_kas')->nullable()->constrained('master_coas')->onDelete('cascade');
            $table->foreignId('id_account_beban')->nullable()->constrained('master_coas')->onDelete('cascade');
            $table->string('no_bukti');
            $table->string('gudang');
            $table->integer('periode');
            $table->date('tanggal_transaksi')->nullable();
            $table->decimal('nominal', 15, 2)->default(0);
            $table->string('keterangan')->nullable();
            $table->string('mesin')->nullable();
            $table->integer('kode')->nullable();
            $table->string('nopol')->nullable();
            $table->string('odometer')->nullable();
            $table->string('jenis')->nullable();
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
        Schema::dropIfExists('operasional_pays');
    }
};
