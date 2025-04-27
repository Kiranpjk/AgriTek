<?php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FarmerController;
use App\Http\Controllers\Api\LandController;
use App\Http\Controllers\Api\SchemeController;
use App\Http\Controllers\Api\BeneficiaryController;
use App\Http\Controllers\Api\AerialDataController;

// Farmer routes
Route::apiResource('farmers', FarmerController::class);

// Land routes
Route::apiResource('lands', LandController::class);

// Scheme routes
Route::apiResource('schemes', SchemeController::class);

// Beneficiary routes
Route::apiResource('beneficiaries', BeneficiaryController::class);

// Aerial data routes
Route::apiResource('aerial-data', AerialDataController::class)->except(['update']);
Route::post('aerial-data/{id}/analyze', [AerialDataController::class, 'analyze']);

// Dashboard statistics
Route::get('stats/dashboard', function() {
    return response()->json([
        'farmers_count' => \App\Models\Farmer::count(),
        'lands_count' => \App\Models\Land::count(),
        'schemes_count' => \App\Models\Scheme::count(),
        'active_schemes' => \App\Models\Scheme::where('status', 'active')->count(),
        'beneficiaries_count' => \App\Models\Beneficiary::count(),
        'pending_applications' => \App\Models\Beneficiary::where('status', 'pending')->count(),
        'aerial_data_count' => \App\Models\AerialData::count(),
        'analyses_count' => \App\Models\TrajectoryAnalysis::count(),
    ]);
});
