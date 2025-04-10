<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CategoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_category_item',
        'nama_category_item',
    ];
    
}
