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
         Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->dropForeign(['id_purchase_request_item']);
        });

        /**
         * 2. ALTER column
         */
        Schema::table('purchase_order_items', function (Blueprint $table) {

            // id_purchase_request_item jadi nullable
            $table->foreignId('id_purchase_request_item')
                ->nullable()
                ->change();

            // diskon_satuan kasih default 0
            $table->decimal('diskon_satuan', 15, 2)
                ->default(0)
                ->change();
        });

        /**
         * 3. PASANG FK lagi
         */
        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->foreign('id_purchase_request_item')
                ->references('id')
                ->on('purchase_request_items')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->dropForeign(['id_purchase_request_item']);
        });

        /**
         * 2. ALTER column
         */
        Schema::table('purchase_order_items', function (Blueprint $table) {

            // id_purchase_request_item jadi nullable
            $table->foreignId('id_purchase_request_item')
                ->nullable()
                ->change();

            // diskon_satuan kasih default 0
            $table->decimal('diskon_satuan', 15, 2)
                ->default(0)
                ->change();
        });

        /**
         * 3. PASANG FK lagi
         */
        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->foreign('id_purchase_request_item')
                ->references('id')
                ->on('purchase_request_items')
                ->onDelete('cascade');
        });
    }
};
