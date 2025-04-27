<?php
// app/Models/Farmer.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Farmer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'phone', 'email', 'address', 'id_number',
        'dob', 'gender', 'profile_image'
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    public function lands()
    {
        return $this->hasMany(Land::class);
    }

    public function beneficiaries()
    {
        return $this->hasMany(Beneficiary::class);
    }
}
