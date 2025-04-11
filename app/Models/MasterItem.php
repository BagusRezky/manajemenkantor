<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class MasterItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_master_item',
        'satuan_satu_id',
        'id_category_item',
        'id_type_item',
        'qty',
        'panjang',
        'lebar',
        'tinggi',
        'berat',
    ];
    public function typeItem()
    {
        return $this->belongsTo(TypeItem::class, 'id_type_item');
    }
    public function categoryItem()
    {
        return $this->belongsTo(CategoryItem::class, 'id_category_item');
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'satuan_satu_id');
    }
}
