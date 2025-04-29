<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Farmer;

class FarmerSeeder extends Seeder
{
    public function run(): void
    {
        Farmer::factory()->count(100)->create();
    }
}
