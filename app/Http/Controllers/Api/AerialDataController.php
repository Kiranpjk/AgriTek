<?php
// app/Http/Controllers/Api/AerialDataController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AerialData;
use App\Models\Land;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AerialDataController extends Controller
{
    public function index(Request $request)
    {
        $query = AerialData::with('land.farmer');
        
        if ($request->has('land_id')) {
            $query->where('land_id', $request->land_id);
        }
        
        $aerialData = $query->get();
        return response()->json(['data' => $aerialData], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'land_id' => 'required|exists:lands,id',
            'capture_date' => 'required|date',
            'aerial_file' => 'required|file|max:102400', // 100MB max
            'resolution' => 'nullable|integer',
            'metadata' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $data = $request->except('aerial_file');
        
        if ($request->hasFile('aerial_file')) {
            $file = $request->file('aerial_file');
            $path = $file->store('aerial_data', 'public');
            $data['file_path'] = $path;
            $data['file_type'] = $file->getClientOriginalExtension();
        }

        if ($request->has('metadata') && is_string($request->metadata)) {
            $data['metadata'] = json_decode($request->metadata, true);
        }

        $aerialData = AerialData::create($data);
        
        // Trigger trajectory analysis job
        // dispatch(new AnalyzeTrajectoryJob($aerialData));
        
        return response()->json(['data' => $aerialData, 'message' => 'Aerial data uploaded successfully'], 201);
    }

    public function show($id)
    {
        $aerialData = AerialData::with(['land.farmer', 'trajectoryAnalyses'])->findOrFail($id);
        return response()->json(['data' => $aerialData], 200);
    }

    public function destroy($id)
    {
        $aerialData = AerialData::findOrFail($id);
        
        // Delete file if exists
        if ($aerialData->file_path) {
            Storage::disk('public')->delete($aerialData->file_path);
        }
        
        $aerialData->delete();
        
        return response()->json(['message' => 'Aerial data deleted successfully'], 200);
    }

    public function analyze($id)
    {
        $aerialData = AerialData::findOrFail($id);
        
        // This would typically dispatch a job or call a service
        // But for demo purposes, we'll create a simple analysis
        
        $analysis = $aerialData->trajectoryAnalyses()->create([
            'analysis_type' => 'object_clustering',
            'trajectory_data' => [
                'points' => $this->generateDemoTrajectoryPoints(),
                'timestamp' => now()->timestamp,
                'metadata' => [
                    'algorithm' => 'DBSCAN',
                    'parameters' => [
                        'eps' => 0.5,
                        'min_samples' => 5
                    ]
                ]
            ],
            'clusters' => [
                'count' => 3,
                'centroids' => $this->generateDemoCentroids(),
                'stats' => [
                    'avg_distance' => 124.5,
                    'max_distance' => 312.8,
                    'density' => 0.75
                ]
            ],
            'summary' => 'Identified 3 distinct object clusters based on trajectory analysis.'
        ]);
        
        return response()->json([
            'data' => $analysis, 
            'message' => 'Trajectory analysis completed successfully'
        ], 200);
    }

    private function generateDemoTrajectoryPoints()
    {
        $points = [];
        for ($i = 0; $i < 100; $i++) {
            $points[] = [
                'id' => $i,
                'x' => rand(0, 1000) / 10,
                'y' => rand(0, 1000) / 10,
                'timestamp' => now()->subMinutes(rand(0, 60))->timestamp,
                'velocity' => rand(0, 100) / 10,
                'direction' => rand(0, 360),
                'cluster_id' => rand(1, 3)
            ];
        }
        return $points;
    }

    private function generateDemoCentroids()
    {
        return [
            ['id' => 1, 'x' => 45.2, 'y' => 32.7, 'size' => 34],
            ['id' => 2, 'x' => 15.8, 'y' => 67.3, 'size' => 26],
            ['id' => 3, 'x' => 78.4, 'y' => 23.5, 'size' => 18]
        ];
    }
}
