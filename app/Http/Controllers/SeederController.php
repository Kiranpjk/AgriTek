<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class SeederController extends Controller
{
    public function seedFarmers(Request $request)
    {
        try {
            Artisan::call('db:seed', ['--class' => 'FarmerSeeder']);
            return response()->json([
                'message' => 'Farmers seeded successfully',
                'data' => []
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Seeding failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
