<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InternalMaterialRequestItem extends Model
{
    use HasFactory;

    protected $table = 'imr_items';

    protected $fillable = [
        'id_imr',
        'id_kartu_instruksi_kerja_bom',
        'qty_request',
        'qty_approved',
    ];

    public function internalMaterialRequest()
    {
        return $this->belongsTo(InternalMaterialRequest::class, 'id_imr');
    }

    public function kartuInstruksiKerjaBom()
    {
        return $this->belongsTo(KartuInstruksiKerjaBom::class, 'id_kartu_instruksi_kerja_bom');
    }
}
