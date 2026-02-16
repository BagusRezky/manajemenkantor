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
         /**
         * 1. DROP FK dulu
         */
        Schema::table('penerimaan_barang_items', function (Blueprint $table) {
            $table->dropForeign(['id_purchase_order_item']);
        });

        /**
         * 2. ALTER column
         */
        Schema::table('penerimaan_barang_items', function (Blueprint $table) {

            // id_purchase_order_item jadi nullable
            $table->foreignId('id_purchase_order_item')
                ->nullable()
                ->change();

            // qty_penerimaan dari integer -> decimal
            $table->decimal('qty_penerimaan', 15, 2)
                ->change();
        });

        /**
         * 3. PASANG FK lagi
         */
        Schema::table('penerimaan_barang_items', function (Blueprint $table) {
            $table->foreign('id_purchase_order_item')
                ->references('id')
                ->on('purchase_order_items')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        /**
         * rollback
         */
        Schema::table('penerimaan_barang_items', function (Blueprint $table) {
            $table->dropForeign(['id_purchase_order_item']);
        });

        Schema::table('penerimaan_barang_items', function (Blueprint $table) {

            $table->foreignId('id_purchase_order_item')
                ->nullable(false)
                ->change();

            $table->integer('qty_penerimaan')
                ->change();
        });

        Schema::table('penerimaan_barang_items', function (Blueprint $table) {
            $table->foreign('id_purchase_order_item')
                ->references('id')
                ->on('purchase_order_items')
                ->onDelete('cascade');
        });
    }
};
