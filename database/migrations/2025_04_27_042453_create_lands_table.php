<?php
// database/migrations/2025_04_27_000002_create_lands_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('lands', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->decimal('area', 10, 2);
            $table->string('unit')->default('hectares');
            $table->text('address')->nullable();
            $table->json('coordinates')->nullable();
            $table->string('soil_type')->nullable();
            $table->string('irrigation_type')->nullable();
            $table->string('ownership_document')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('lands');
    }
};
