<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubcountOutItem extends Model
{
    protected $fillable = [
        'id_subcount_out',
        'id_kartu_instruksi_kerja',
        'id_unit',
        'qty',
        'keterangan',
    ];

    public function subcountOut()
    {
        return $this->belongsTo(SubcountOut::class, 'id_subcount_out');
    }

    public function kartuInstruksiKerja()
    {
        return $this->belongsTo(KartuInstruksiKerja::class, 'id_kartu_instruksi_kerja');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'id_unit');
    }
}
