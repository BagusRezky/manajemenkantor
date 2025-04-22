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
        Schema::create('item_references', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_purchase_request_item')->constrained('purchase_request_items')->onDelete('cascade');
            $table->enum('type', ['department', 'customer']);
            $table->foreignId('id_department')->nullable()->constrained('departemens');
            $table->foreignId('id_customer_address')->nullable()->constrained('customer_addresses');
            $table->foreignId('id_kartu_instruksi_kerja')->nullable()->constrained('kartu_instruksi_kerjas');
            $table->decimal('qty', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_references');
    }
};
