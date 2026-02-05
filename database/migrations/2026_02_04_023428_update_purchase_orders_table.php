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
         * 1. DROP FK dulu (wajib)
         */
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->dropForeign(['id_purchase_request']);
        });

        /**
         * 2. ALTER COLUMN
         */
        Schema::table('purchase_orders', function (Blueprint $table) {

            // id_purchase_request jadi nullable
            $table->foreignId('id_purchase_request')
                ->nullable()
                ->change();

            // ongkir & dp dari integer -> decimal
            $table->decimal('ongkir', 15, 2)
                ->default(0)
                ->change();

            $table->decimal('dp', 15, 2)
                ->default(0)
                ->change();

            // tambah kolom bridge ke sistem lama
            $table->string('old_po_number')
                ->nullable()
                ->index()
                ->after('no_po');
        });

        /**
         * 3. PASANG FK LAGI
         */
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->foreign('id_purchase_request')
                ->references('id')
                ->on('purchase_requests')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        /**
         * rollback aman
         */
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->dropForeign(['id_purchase_request']);
            $table->dropColumn('old_po_number');
        });

        Schema::table('purchase_orders', function (Blueprint $table) {

            $table->foreignId('id_purchase_request')
                ->nullable(false)
                ->change();

            $table->integer('ongkir')
                ->default(0)
                ->change();

            $table->integer('dp')
                ->default(0)
                ->change();
        });

        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->foreign('id_purchase_request')
                ->references('id')
                ->on('purchase_requests')
                ->onDelete('cascade');
        });
    }
};
