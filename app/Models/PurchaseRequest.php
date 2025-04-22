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
    ];

    protected $casts = [
        'tgl_pr' => 'date',
    ];

    public function departemen()
    {
        return $this->belongsTo(Departemen::class, 'id_department');
    }

    public function purchaseRequestItems()
    {
        return $this->hasMany(PurchaseRequestItem::class, 'id_purchase_request');
    }
}
