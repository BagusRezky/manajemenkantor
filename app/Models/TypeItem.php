<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypeItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_type_item',
        'nama_type_item',
    ];
}
