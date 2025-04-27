<?php
// app/Models/Scheme.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scheme extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'start_date', 'end_date',
        'budget', 'eligibility_criteria', 'benefits', 'status'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'budget' => 'decimal:2',
    ];

    public function beneficiaries()
    {
        return $this->hasMany(Beneficiary::class);
    }
}
