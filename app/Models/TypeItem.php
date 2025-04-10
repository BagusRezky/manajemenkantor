<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypeItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_category_item',
        'kode_type_item',
        'nama_type_item',
    ];

    public function masterKonversi()
    {
        return $this->hasMany(MasterKonversi::class, 'id_type_item');
    }

    public function categoryItem()
    {
        return $this->belongsTo(CategoryItem::class, 'id_category_item');
    }

}
