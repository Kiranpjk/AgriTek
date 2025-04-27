<?php
// app/Http/Controllers/Api/FarmerController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Farmer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FarmerController extends Controller
{
    public function index()
    {
        $farmers = Farmer::with('lands')->get();
        return response()->json(['data' => $farmers], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'id_number' => 'required|string|unique:farmers',
            'dob' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $data = $request->all();
        
        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('farmers', 'public');
            $data['profile_image'] = $path;
        }

        $farmer = Farmer::create($data);
        
        return response()->json(['data' => $farmer, 'message' => 'Farmer created successfully'], 201);
    }

    public function show($id)
    {
        $farmer = Farmer::with(['lands', 'beneficiaries.scheme'])->findOrFail($id);
        return response()->json(['data' => $farmer], 200);
    }

    public function update(Request $request, $id)
    {
        $farmer = Farmer::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'id_number' => 'sometimes|required|string|unique:farmers,id_number,' . $id,
            'dob' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $data = $request->all();
        
        if ($request->hasFile('profile_image')) {
            // Delete old image if exists
            if ($farmer->profile_image) {
                Storage::disk('public')->delete($farmer->profile_image);
            }
            
            $path = $request->file('profile_image')->store('farmers', 'public');
            $data['profile_image'] = $path;
        }

        $farmer->update($data);
        
        return response()->json(['data' => $farmer, 'message' => 'Farmer updated successfully'], 200);
    }

    public function destroy($id)
    {
        $farmer = Farmer::findOrFail($id);
        
        // Delete profile image if exists
        if ($farmer->profile_image) {
            Storage::disk('public')->delete($farmer->profile_image);
        }
        
        $farmer->delete();
        
        return response()->json(['message' => 'Farmer deleted successfully'], 200);
    }
}
