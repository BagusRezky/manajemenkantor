<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengajuanPinjaman extends Model
{
    use HasFactory;

    protected $table = 'pengajuan_pinjamans';

    protected $fillable = [
        'id_karyawan',
        'kode_gudang',
        'nomor_bukti_pengajuan',
        'tanggal_pengajuan',
        'nilai_pinjaman',
        'jangka_waktu_pinjaman',
        'cicilan_per_bulan',
        'keperluan_pinjaman',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }
}
