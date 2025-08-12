<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturInternalItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_retur_internal',
        'id_imr_item',
        'id_imr_diemaking_item',
        'id_imr_finishing_item',
        'qty_approved_retur',
    ];

    public function returInternal()
    {
        return $this->belongsTo(ReturInternal::class, 'id_retur_internal');
    }

    public function imrItem()
    {
        return $this->belongsTo(InternalMaterialRequestItem::class, 'id_imr_item');
    }

    public function imrDiemakingItem()
    {
        return $this->belongsTo(ImrDiemakingItem::class, 'id_imr_diemaking_item');
    }

    public function imrFinishingItem()
    {
        return $this->belongsTo(ImrFinishingItem::class, 'id_imr_finishing_item');
    }
}
