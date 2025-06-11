<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PenerimaanBarangItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_penerimaan_barang',
        'id_purchase_order_item',
        'qty_penerimaan',
        'catatan_item',
        'tgl_expired',
        'no_delivery_order',
    ];

    public function penerimaanBarang()
    {
        return $this->belongsTo(PenerimaanBarang::class, 'id_penerimaan_barang');
    }
    public function purchaseOrderItem()
    {
        return $this->belongsTo(PurchaseOrderItem::class, 'id_purchase_order_item');
    }
    public function returEksternalItems()
    {
        return $this->hasMany(ReturEksternalItem::class, 'id_penerimaan_barang_item');
    }
}
