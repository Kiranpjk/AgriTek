<?php
// app/Models/AerialData.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AerialData extends Model
{
    use HasFactory;

    protected $fillable = [
        'land_id', 'capture_date', 'file_path', 
        'file_type', 'resolution', 'metadata'
    ];

    protected $casts = [
        'capture_date' => 'date',
        'metadata' => 'array',
    ];

    public function land()
    {
        return $this->belongsTo(Land::class);
    }

    public function trajectoryAnalyses()
    {
        return $this->hasMany(TrajectoryAnalysis::class);
    }
}
