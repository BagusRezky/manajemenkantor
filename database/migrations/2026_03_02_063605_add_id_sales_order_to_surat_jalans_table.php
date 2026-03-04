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
        Schema::table('surat_jalans', function (Blueprint $table) {
           $table->foreignId('id_sales_order')->nullable()->after('id')->constrained('sales_orders')->onDelete('cascade');
            $table->unsignedBigInteger('id_kartu_instruksi_kerja')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat_jalans', function (Blueprint $table) {

            $table->dropForeign(['id_sales_order']);
            $table->dropColumn('id_sales_order');
            $table->unsignedBigInteger('id_kartu_instruksi_kerja')->nullable(false)->change();
        });
    }
};
