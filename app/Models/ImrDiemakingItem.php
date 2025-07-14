<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImrDiemakingItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_imr_diemaking',
        'id_kartu_instruksi_kerja_bom',
        'qty_request',
        'qty_approved',
    ];

    public function internalMaterialRequest()
    {
        return $this->belongsTo(ImrDiemaking::class, 'id_imr_diemaking');
    }
    public function kartuInstruksiKerjaBom()
    {
        return $this->belongsTo(KartuInstruksiKerjaBom::class, 'id_kartu_instruksi_kerja_bom');
    }
}
