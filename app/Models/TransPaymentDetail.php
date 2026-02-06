<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransPaymentDetail extends Model
{
    protected $table = 'trans_payment_details';

    protected $fillable = [
        'id_trans_payment',
        'id_metode_bayar',
        'id_account_debit',
        'id_account_kredit',
        'tanggal_pembayaran',
        'curs',
        'bank',
        'an_rekening',
        'no_rekening',
        'nominal',
        'keterangan'
    ];

    public function transPayment()
    {
        return $this->belongsTo(TransPayment::class, 'id_trans_payment');
    }

    public function metodeBayar()
    {
        return $this->belongsTo(MetodeBayar::class, 'id_metode_bayar');
    }

    public function accountDebit()
    {
        return $this->belongsTo(MasterCoa::class, 'id_account_debit');
    }

    public function accountKredit()
    {
        return $this->belongsTo(MasterCoa::class, 'id_account_kredit');
    }
}
