<?php
// database/migrations/2025_04_27_000003_create_schemes_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('schemes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('budget', 12, 2)->default(0);
            $table->text('eligibility_criteria');
            $table->text('benefits');
            $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('schemes');
    }
};
