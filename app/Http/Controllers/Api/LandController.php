<?php
// app/Http/Controllers/Api/LandController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Land;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class LandController extends Controller
{
    public function index(Request $request)
    {
        $query = Land::with('farmer');
        
        if ($request->has('farmer_id')) {
            $query->where('farmer_id', $request->farmer_id);
        }
        
        $lands = $query->get();
        return response()->json(['data' => $lands], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'farmer_id' => 'required|exists:farmers,id',
            'title' => 'required|string|max:255',
            'area' => 'required|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'coordinates' => 'nullable|json',
            'soil_type' => 'nullable|string|max:100',
            'irrigation_type' => 'nullable|string|max:100',
            'ownership_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $data = $request->all();
        
        if ($request->hasFile('ownership_document')) {
            $path = $request->file('ownership_document')->store('land_documents', 'public');
            $data['ownership_document'] = $path;
        }

        if ($request->has('coordinates') && is_string($request->coordinates)) {
            $data['coordinates'] = json_decode($request->coordinates, true);
        }

        $land = Land::create($data);
        
        return response()->json(['data' => $land, 'message' => 'Land created successfully'], 201);
    }

    public function show($id)
    {
        $land = Land::with(['farmer', 'aerialData'])->findOrFail($id);
        return response()->json(['data' => $land], 200);
    }

    public function update(Request $request, $id)
    {
        $land = Land::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'farmer_id' => 'sometimes|required|exists:farmers,id',
            'title' => 'sometimes|required|string|max:255',
            'area' => 'sometimes|required|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'coordinates' => 'nullable|json',
            'soil_type' => 'nullable|string|max:100',
            'irrigation_type' => 'nullable|string|max:100',
            'ownership_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $data = $request->all();
        
        if ($request->hasFile('ownership_document')) {
            // Delete old document if exists
            if ($land->ownership_document) {
                Storage::disk('public')->delete($land->ownership_document);
            }
            
            $path = $request->file('ownership_document')->store('land_documents', 'public');
            $data['ownership_document'] = $path;
        }

        if ($request->has('coordinates') && is_string($request->coordinates)) {
            $data['coordinates'] = json_decode($request->coordinates, true);
        }

        $land->update($data);
        
        return response()->json(['data' => $land, 'message' => 'Land updated successfully'], 200);
    }

    public function destroy($id)
    {
        $land = Land::findOrFail($id);
        
        // Delete document if exists
        if ($land->ownership_document) {
            Storage::disk('public')->delete($land->ownership_document);
        }
        
        $land->delete();
        
        return response()->json(['message' => 'Land deleted successfully'], 200);
    }
}
