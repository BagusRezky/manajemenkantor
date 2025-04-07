<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypeOffice extends Model
{
    use HasFactory;
    protected $fillable = [
        'kode_type_office',
        'nama_type_office',
    ];
}
