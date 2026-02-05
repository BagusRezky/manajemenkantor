<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PoBillingDetail extends Model
{
    protected $table = 'po_billing_details';

    protected $fillable = [
        'id_po_billing',
        'id_penerimaan_barang_item',
        'master_item',
        'qty',
        'harga_per_qty',
        'discount',
        'unit',
        // 3 legacy columns
        'total',
        'ppn',
        'total_semua',

    ];

    public function poBilling()
    {
        return $this->belongsTo(PoBilling::class, 'id_po_billing');
    }

    public function penerimaanBarangItem()
    {
        return $this->belongsTo(PenerimaanBarangItem::class, 'id_penerimaan_barang_item');
    }
}
