<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BonPay extends Model
{
    use HasFactory;

    protected $fillable = ['id_invoice', 'id_metode_bayar', 'id_account', 'id_karyawan', 'nomor_pembayaran', 'nominal_pembayaran', 'gudang', 'keterangan', 'tanggal_pembayaran'];
    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'id_invoice');
    }
    public function metodeBayar()
    {
        return $this->belongsTo(MetodeBayar::class, 'id_metode_bayar');
    }
    public function account()
    {
        return $this->belongsTo(MasterCoa::class, 'id_account');
    }
    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }
}
