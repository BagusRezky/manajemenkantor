<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Printing extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_printing',
        'id_kartu_instruksi_kerja',
        'id_mesin',
        'id_operator',
        'tanggal_entri',
        'proses_printing',
        'tahap_printing',
        'hasil_baik_printing',
        'hasil_rusak_printing',
        'semi_waste_printing',
        'keterangan_printing',
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
