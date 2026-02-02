<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperasionalPay extends Model
{
    protected $table = 'operasional_pays';
    use HasFactory;
    protected $fillable = [
        'id_karyawan',
        'id_account_kas',
        'id_account_beban',
        'no_bukti',
        'gudang',
        'periode',
        'tanggal_transaksi',
        'nominal',
        'keterangan',
        'mesin',
        'kode',
        'nopol',
        'odometer',
        'jenis',
        'status',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }

    public function accountKas()
    {
        return $this->belongsTo(MasterCoa::class, 'id_account_kas');
    }

    public function accountBeban()
    {
        return $this->belongsTo(MasterCoa::class, 'id_account_beban');
    }
}
