<?php
// app/Models/Beneficiary.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beneficiary extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id', 'scheme_id', 'land_id', 'application_date',
        'status', 'amount_received', 'remarks'
    ];

    protected $casts = [
        'application_date' => 'date',
        'amount_received' => 'decimal:2',
    ];

    public function farmer()
    {
        return $this->belongsTo(Farmer::class);
    }

    public function scheme()
    {
        return $this->belongsTo(Scheme::class);
    }

    public function land()
    {
        return $this->belongsTo(Land::class);
    }
}
