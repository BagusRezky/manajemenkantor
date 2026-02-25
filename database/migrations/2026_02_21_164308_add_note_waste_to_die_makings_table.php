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
        Schema::table('die_makings', function (Blueprint $table) {
            $table->foreignId('id_note_waste_diemaking')->nullable()->constrained('eror_productions')->after('id_operator_diemaking')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('die_makings', function (Blueprint $table) {
            $table->dropForeign(['id_note_waste_diemaking']);
            $table->dropColumn('id_note_waste_diemaking');
        });
    }
};
