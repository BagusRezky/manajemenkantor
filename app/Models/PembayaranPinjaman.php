<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PembayaranPinjaman extends Model
{
    use HasFactory;

    protected $table = 'pembayaran_pinjamans';

    protected $fillable = [
        'id_pengajuan_pinjaman',
        'tahap_cicilan',
        'tanggal_pembayaran',
        'nominal_pembayaran',
        'keterangan',
    ];

    public function pengajuanPinjaman()
    {
        return $this->belongsTo(PengajuanPinjaman::class, 'id_pengajuan_pinjaman');
    }
}
