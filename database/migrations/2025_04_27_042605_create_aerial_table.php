<?php
// database/migrations/2025_04_27_000005_create_aerial_data_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('aerial_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('land_id')->constrained()->onDelete('cascade');
            $table->date('capture_date');
            $table->string('file_path');
            $table->string('file_type');
            $table->integer('resolution')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('aerial_data');
    }
};
