<?php
// app/Http/Controllers/Api/BeneficiaryController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Beneficiary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BeneficiaryController extends Controller
{
    public function index(Request $request)
    {
        $query = Beneficiary::with(['farmer', 'scheme', 'land']);
        
        if ($request->has('farmer_id')) {
            $query->where('farmer_id', $request->farmer_id);
        }
        
        if ($request->has('scheme_id')) {
            $query->where('scheme_id', $request->scheme_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $beneficiaries = $query->get();
        return response()->json(['data' => $beneficiaries], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'farmer_id' => 'required|exists:farmers,id',
            'scheme_id' => 'required|exists:schemes,id',
            'land_id' => 'nullable|exists:lands,id',
            'application_date' => 'required|date',
            'status' => 'required|in:pending,approved,rejected,completed',
            'amount_received' => 'nullable|numeric|min:0',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $beneficiary = Beneficiary::create($request->all());
        
        return response()->json(['data' => $beneficiary, 'message' => 'Beneficiary created successfully'], 201);
    }

    public function show($id)
    {
        $beneficiary = Beneficiary::with(['farmer', 'scheme', 'land'])->findOrFail($id);
        return response()->json(['data' => $beneficiary], 200);
    }

    public function update(Request $request, $id)
    {
        $beneficiary = Beneficiary::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'farmer_id' => 'sometimes|required|exists:farmers,id',
            'scheme_id' => 'sometimes|required|exists:schemes,id',
            'land_id' => 'nullable|exists:lands,id',
            'application_date' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:pending,approved,rejected,completed',
            'amount_received' => 'nullable|numeric|min:0',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $beneficiary->update($request->all());
        
        return response()->json(['data' => $beneficiary, 'message' => 'Beneficiary updated successfully'], 200);
    }

    public function destroy($id)
    {
        $beneficiary = Beneficiary::findOrFail($id);
        $beneficiary->delete();
        
        return response()->json(['message' => 'Beneficiary deleted successfully'], 200);
    }
}
