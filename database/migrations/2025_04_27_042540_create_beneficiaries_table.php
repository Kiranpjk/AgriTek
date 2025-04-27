<?php
// database/migrations/2025_04_27_000004_create_beneficiaries_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('beneficiaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained()->onDelete('cascade');
            $table->foreignId('scheme_id')->constrained()->onDelete('cascade');
            $table->foreignId('land_id')->nullable()->constrained()->onDelete('set null');
            $table->date('application_date');
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->decimal('amount_received', 12, 2)->default(0);
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('beneficiaries');
    }
};
