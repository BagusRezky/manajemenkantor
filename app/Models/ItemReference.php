<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemReference extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_purchase_request_item',
        'type',
        'id_department',
        'id_customer_address',
        'id_kartu_instruksi_kerja',
        'qty',
    ];

    protected $casts = [
        'qty' => 'float',
    ];

    public function purchaseRequestItem()
    {
        return $this->belongsTo(PurchaseRequestItem::class, 'id_purchase_request_item');
    }

    public function departemen()
    {
        return $this->belongsTo(Departemen::class, 'id_department');
    }

    public function customerAddress()
    {
        return $this->belongsTo(customerAddress::class, 'id_customer_address');
    }

    public function kartuInstruksiKerja()
    {
        return $this->belongsTo(KartuInstruksiKerja::class, 'id_kartu_instruksi_kerja');
    }
}
