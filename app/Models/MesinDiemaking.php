<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MesinDiemaking extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_mesin_diemaking',
        'jenis_mesin_diemaking',
        'kapasitas_diemaking',
        'proses_diemaking',
        'status_diemaking',
    ];
}
