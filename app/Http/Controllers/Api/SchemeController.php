<?php
// app/Http/Controllers/Api/SchemeController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Scheme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SchemeController extends Controller
{
    public function index(Request $request)
    {
        $query = Scheme::query();
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $schemes = $query->get();
        return response()->json(['data' => $schemes], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'eligibility_criteria' => 'required|string',
            'benefits' => 'required|string',
            'status' => 'required|in:active,inactive,draft',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $scheme = Scheme::create($request->all());
        
        return response()->json(['data' => $scheme, 'message' => 'Scheme created successfully'], 201);
    }

    public function show($id)
    {
        $scheme = Scheme::with('beneficiaries.farmer')->findOrFail($id);
        return response()->json(['data' => $scheme], 200);
    }

    public function update(Request $request, $id)
    {
        $scheme = Scheme::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'eligibility_criteria' => 'sometimes|required|string',
            'benefits' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:active,inactive,draft',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $scheme->update($request->all());
        
        return response()->json(['data' => $scheme, 'message' => 'Scheme updated successfully'], 200);
    }

    public function destroy($id)
    {
        $scheme = Scheme::findOrFail($id);
        $scheme->delete();
        
        return response()->json(['message' => 'Scheme deleted successfully'], 200);
    }
}
