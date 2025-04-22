<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PurchaseRequestItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_purchase_request',
        'id_master_item',
        'qty',
        'eta',
        'catatan',
    ];

    protected $casts = [
        'qty' => 'float',
        'eta' => 'date',
    ];

    public function purchaseRequest()
    {
        return $this->belongsTo(PurchaseRequest::class, 'id_purchase_request');
    }

    public function masterItem()
    {
        return $this->belongsTo(MasterItem::class, 'id_master_item');
    }

    public function itemReferences()
    {
        return $this->hasMany(ItemReference::class, 'id_purchase_request_item');
    }
}
