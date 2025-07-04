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
        'id_mesin',
        'id_operator',
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
    public function mesin()
    {
        return $this->belongsTo(Mesin::class, 'id_mesin');
    }
    public function operator()
    {
        return $this->belongsTo(Operator::class, 'id_operator');
    }
}
