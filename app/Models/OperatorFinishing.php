<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperatorFinishing extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_operator_finishing',
    ];

    public function finishings()
    {
        return $this->hasMany(Finishing::class, 'id_operator_finishing');
    }
}
