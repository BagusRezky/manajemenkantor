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
        'nama_master_item',
        'min_stock',
        'min_order',
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
    public function billOfMaterials()
    {
        return $this->hasMany(BillOfMaterial::class, 'id_master_item');
    }
    public function purchaseRequestItem()
    {
        return $this->hasMany(PurchaseRequestItem::class, 'id_master_item');
    }
}
