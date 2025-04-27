<?php
// app/Models/TrajectoryAnalysis.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrajectoryAnalysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'aerial_data_id', 'analysis_type', 'trajectory_data',
        'clusters', 'summary'
    ];

    protected $casts = [
        'trajectory_data' => 'array',
        'clusters' => 'array',
    ];

    public function aerialData()
    {
        return $this->belongsTo(AerialData::class);
    }
}
