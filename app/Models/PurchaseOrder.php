<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_purchase_request',
        'id_supplier',
        'no_po',
        'tanggal_po',
        'eta',
        'mata_uang',
        'ppn'
    ];

    protected $casts = [
        'tanggal_po' => 'date',
    ];

    public function purchaseRequest()
    {
        return $this->belongsTo(PurchaseRequest::class, 'id_purchase_request');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'id_supplier');
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class, 'id_purchase_order');
    }
}
