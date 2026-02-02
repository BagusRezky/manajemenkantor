<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TransKasBank extends Model
{
    protected $table = 'trans_kas_banks';

    use HasFactory;
    protected $fillable = [
        'id_karyawan',
        'id_account_bank',
        'id_account_bank_lain',
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
        'bank',
        'bank_an',
        'no_rekening',
        'status',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }

    public function accountBank()
    {
        return $this->belongsTo(MasterCoa::class, 'id_account_bank');
    }

    public function accountBankLain()
    {
        return $this->belongsTo(MasterCoa::class, 'id_account_bank_lain');
    }

    public function customerAddress()
    {
        return $this->belongsTo(customerAddress::class, 'id_customer_address');
    }
}
