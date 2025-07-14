<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DieMaking extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_diemaking',
        'id_kartu_instruksi_kerja',
        'id_mesin_diemaking',      // Updated
        'id_operator_diemaking',   // Updated
        'tanggal_entri',
        'proses_diemaking',
        'tahap_diemaking',
        'hasil_baik_diemaking',
        'hasil_rusak_diemaking',
        'semi_waste_diemaking',
        'keterangan_diemaking',
    ];
    public function kartuInstruksiKerja()
    {
        return $this->belongsTo(KartuInstruksiKerja::class, 'id_kartu_instruksi_kerja');
    }
    public function mesinDiemaking()
    {
        return $this->belongsTo(MesinDiemaking::class, 'id_mesin_diemaking');
    }
    public function operatorDiemaking()
    {
        return $this->belongsTo(OperatorDiemaking::class, 'id_operator_diemaking');
    }
}
