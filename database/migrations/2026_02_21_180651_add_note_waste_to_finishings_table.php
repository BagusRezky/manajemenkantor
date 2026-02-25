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
        Schema::table('finishings', function (Blueprint $table) {
            $table->foreignId('id_note_waste_finishing')->nullable()->constrained('eror_productions')->onDelete('cascade')->after('id_operator_finishing');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('finishings', function (Blueprint $table) {
            $table->dropForeign(['id_note_waste_finishing']);
            $table->dropColumn('id_note_waste_finishing');
        });
    }
};
