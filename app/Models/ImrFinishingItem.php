<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ImrFinishingItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_imr_finishing',
        'id_kartu_instruksi_kerja_bom',
        'qty_request',
        'qty_approved',
    ];

    public function internalMaterialRequest()
    {
        return $this->belongsTo(ImrFinishing::class, 'id_imr_finishing');
    }
    public function kartuInstruksiKerjaBom()
    {
        return $this->belongsTo(KartuInstruksiKerjaBom::class, 'id_kartu_instruksi_kerja_bom');
    }
}
