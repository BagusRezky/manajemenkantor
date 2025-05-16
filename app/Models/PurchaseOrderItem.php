<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_purchase_order',
        'id_purchase_request_item',
        'id_master_item',
        'id_satuan_po',
        'qty_po',
        'harga_satuan',
        'diskon_satuan',
        'jumlah',
        'remark_item_po',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'id_purchase_order');
    }
    public function purchaseRequestItem()
    {
        return $this->belongsTo(PurchaseRequestItem::class, 'id_purchase_request_item');
    }
    public function masterItem()
    {
        return $this->belongsTo(MasterItem::class, 'id_master_item');
    }
    public function satuan()
    {
        return $this->belongsTo(Unit::class, 'id_satuan_po');
    }
    public function penerimaanBarangItem()
    {
        return $this->hasMany(PenerimaanBarangItem::class, 'id_purchase_order_item');
    }
    

}
