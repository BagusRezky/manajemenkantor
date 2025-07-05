<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OperatorDiemaking extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_operator_diemaking',
    ];
    
}
