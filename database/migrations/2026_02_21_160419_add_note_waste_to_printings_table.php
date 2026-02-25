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
        Schema::table('printings', function (Blueprint $table) {
            $table->foreignId('id_note_waste_printing')->nullable()->constrained('eror_productions')->onDelete('cascade')->after('id_operator');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('printings', function (Blueprint $table) {
            $table->dropForeign(['id_note_waste_printing']);
            $table->dropColumn('id_note_waste_printing');
        });
    }
};
