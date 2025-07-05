<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Finishing extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_finishing',
        'id_kartu_instruksi_kerja',
        'id_mesin_finishing',
        'id_operator_finishing',
        'tanggal_entri',
        'proses_finishing',
        'tahap_finishing',
        'hasil_baik_finishing',
        'hasil_rusak_finishing',
        'semi_waste_finishing',
        'keterangan_finishing',
    ];

    public function kartuInstruksiKerja()
    {
        return $this->belongsTo(KartuInstruksiKerja::class, 'id_kartu_instruksi_kerja');
    }

    public function mesinFinishing()
    {
        return $this->belongsTo(MesinFinishing::class, 'id_mesin_finishing');
    }

    public function operatorFinishing()
    {
        return $this->belongsTo(OperatorFinishing::class, 'id_operator_finishing');
    }
}
