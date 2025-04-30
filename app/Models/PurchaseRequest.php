<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PurchaseRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'no_pr',
        'id_department',
        'tgl_pr',
        'status',
    ];

    protected $casts = [
        'tgl_pr' => 'date',
    ];

    protected $with = ['departemen'];

    const STATUS_DEOTORISASI = 'Deotorisasi';
    const STATUS_OTORISASI = 'Otorisasi';

    public function departemen()
    {
        return $this->belongsTo(Departemen::class, 'id_department');
    }

    public function purchaseRequestItems()
    {
        return $this->hasMany(PurchaseRequestItem::class, 'id_purchase_request');
    }

    public function isAuthorized()
    {
        return $this->status === self::STATUS_OTORISASI;
    }

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class, 'id_purchase_request');
    }
}
