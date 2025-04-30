<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_satuan',
        'nama_satuan',
    ];

    public function satuanSatu()
    {
        return $this->hasMany(MasterKonversi::class, 'satuan_satu_id');
    }

    public function satuanDua()
    {
        return $this->hasMany(MasterKonversi::class, 'satuan_dua_id');
    }

    public function masterItem()
    {
        return $this->hasMany(MasterItem::class, 'satuan_satu_id');
    }

    public function finishGoodItem()
    {
        return $this->hasMany(FinishGoodItem::class, 'satuan_satu_id');
    }

    public function purchaseOrderItem()
    {
        return $this->hasMany(PurchaseOrderItem::class, 'id_satuan_po');
    }
}
