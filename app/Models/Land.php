<?php
// app/Models/Land.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Land extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id', 'title', 'area', 'unit', 'address',
        'coordinates', 'soil_type', 'irrigation_type', 'ownership_document'
    ];

    protected $casts = [
        'coordinates' => 'array',
        'area' => 'decimal:2',
    ];

    public function farmer()
    {
        return $this->belongsTo(Farmer::class);
    }

    public function aerialData()
    {
        return $this->hasMany(AerialData::class);
    }

    public function beneficiaries()
    {
        return $this->hasMany(Beneficiary::class);
    }
}
