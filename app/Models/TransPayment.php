<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransPayment extends Model
{
    use HasFactory;
    protected $table = 'trans_payments';

    protected $fillable = [
        'id_po_billing',
        'id_karyawan',
        'no_pembayaran',
        'tanggal_header',
        'gudang',
        'periode',
    ];

    public function poBilling()
    {
        return $this->belongsTo(PoBilling::class, 'id_po_billing');
    }

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan');
    }

    public function details()
    {
        return $this->hasMany(TransPaymentDetail::class, 'id_trans_payment');
    }
}
