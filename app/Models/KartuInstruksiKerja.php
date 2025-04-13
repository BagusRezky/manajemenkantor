<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class KartuInstruksiKerja extends Model
{
    use HasFactory;

    protected $table = 'kartu_instruksi_kerjas';

    protected $fillable = [
        'id_sales_order',
        'no_kartu_instruksi_kerja',
        'production_plan',
        'tgl_estimasi_selesai',
        'spesifikasi_kertas',
        'up_satu',
        'up_dua',
        'up_tiga',
        'ukuran_potong',
        'ukuran_cetak'
    ];

    protected $casts = [
        'tgl_estimasi_selesai' => 'date',
    ];

    public function salesOrder()
    {
        return $this->belongsTo(SalesOrder::class, 'id_sales_order');
    }
}
