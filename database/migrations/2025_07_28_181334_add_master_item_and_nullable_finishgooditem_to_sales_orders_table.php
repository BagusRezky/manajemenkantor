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
        Schema::table('sales_orders', function (Blueprint $table) {
            // Tambah kolom master_item
            $table->foreignId('id_master_item')->nullable()->constrained('master_items')->onDelete('cascade')->after('id_finish_good_item');

            // Ubah id_finish_good_item jadi nullable juga
            $table->foreignId('id_finish_good_item')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_orders', function (Blueprint $table) {
            $table->dropForeign(['id_master_item']);
            $table->dropColumn('id_master_item');

            // Kembalikan id_finish_good_item jadi required
            $table->foreignId('id_finish_good_item')->nullable(false)->change();
        });
    }
};
