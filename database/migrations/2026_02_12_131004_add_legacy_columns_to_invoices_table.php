<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->foreignId('id_surat_jalan')->nullable()->change();
            $table->foreignId('id_metode_bayar')->nullable()->after('id_surat_jalan')->constrained('metode_bayars')->nullOnDelete();
            $table->date('tgl_invoice')->nullable()->change();
            $table->date('tgl_jatuh_tempo')->nullable()->change();
            $table->decimal('ppn', 10, 2)->nullable()->change();
            $table->integer('ongkos_kirim')->nullable()->change();
            $table->integer('uang_muka')->nullable()->change();
            $table->integer('discount')->nullable()->change();

            // Tambah kolom keuangan untuk laporan
            $table->decimal('total_sub', 15, 2)->default(0)->after('tgl_jatuh_tempo');
            $table->decimal('ppn_nominal', 15, 2)->default(0)->after('total_sub');
            $table->decimal('total', 15, 2)->default(0)->after('ppn_nominal');
            $table->decimal('bayar', 15, 2)->default(0)->after('total');
            $table->decimal('kembali', 15, 2)->default(0)->after('bayar');

            // Kolom pendukung legacy
            $table->string('no_surat_jalan_lama')->nullable()->after('id_surat_jalan');
            $table->string('no_invoice_lama')->nullable()->after('no_surat_jalan_lama');
            $table->string('no_spk_lama')->nullable()->after('no_invoice_lama');
            $table->string('no_so_lama')->nullable()->after('no_spk_lama');
            $table->integer('tempo')->nullable()->default(0)->after('no_so_lama');


            $table->boolean('is_legacy')->default(false)->after('tempo');
            $table->text('keterangan')->nullable()->after('discount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {

            $table->dropForeign(['id_metode_bayar']);

            $table->dropColumn([
                'id_metode_bayar',
                'total_sub',
                'ppn_nominal',
                'total',
                'bayar',
                'kembali',
                'no_surat_jalan_lama',
                'no_invoice_lama',
                'no_spk_lama',
                'no_so_lama',
                'tempo',
                'is_legacy',
                'keterangan'
            ]);
        });
    }
};
