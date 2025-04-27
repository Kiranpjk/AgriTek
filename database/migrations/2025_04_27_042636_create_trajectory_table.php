<?php
// database/migrations/2025_04_27_000006_create_trajectory_analyses_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('trajectory_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('aerial_data_id')->constrained()->onDelete('cascade');
            $table->string('analysis_type');
            $table->json('trajectory_data');
            $table->json('clusters')->nullable();
            $table->text('summary')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('trajectory_analyses');
    }
};
