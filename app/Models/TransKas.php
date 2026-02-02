<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TransKas extends Model
{
    protected $table = 'trans_kas';
    use HasFactory;

    protected $fillable = [
        'id_karyawan',
        'id_account_kas',
        'id_account_kas_lain',
        'id_customer_address',
        'transaksi',
        'no_bukti',
        'gudang',
        'periode',
        'tanggal_transaksi',
        'nominal',
        'keterangan',
        'mesin',
        'kode',
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

    public function accountKasLain()
    {
        return $this->belongsTo(MasterCoa::class, 'id_account_kas_lain');
    }

    public function customerAddress()
    {
        return $this->belongsTo(customerAddress::class, 'id_customer_address');
    }
}
