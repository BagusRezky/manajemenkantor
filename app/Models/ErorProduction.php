<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ErorProduction extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_eror',
        'nama_eror',
    ];
}
