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
    ];

    protected $casts = [
        'tgl_estimasi_selesai' => 'date',
    ];

    public function salesOrder()
    {
        return $this->belongsTo(SalesOrder::class, 'id_sales_order');
    }

    public function sales_order() // alias untuk backward compatibility
    {
        return $this->salesOrder();
    }

    public function itemReferences()
    {
        return $this->hasMany(ItemReference::class, 'id_kartu_instruksi_kerja');
    }

    public function kartuInstruksiKerjaBoms()
    {
        return $this->hasMany(KartuInstruksiKerjaBom::class, 'id_kartu_instruksi_kerja');
    }

    public function internalMaterialRequests()
    {
        return $this->hasMany(InternalMaterialRequest::class, 'id_kartu_instruksi_kerja');
    }
    public function printings()
    {
        return $this->hasMany(Printing::class, 'id_kartu_instruksi_kerja');
    }
    public function dieMakings()
    {
        return $this->hasMany(DieMaking::class, 'id_kartu_instruksi_kerja');
    }

    public function finishings()
    {
        return $this->hasMany(Finishing::class, 'id_kartu_instruksi_kerja');
    }

    public function packagings()
    {
        return $this->hasMany(Packaging::class, 'id_kartu_instruksi_kerja');
    }

    public function suratJalans()
    {
        return $this->hasMany(SuratJalan::class, 'id_kartu_instruksi_kerja');
    }

    public function imrDiemakings()
    {
        return $this->hasMany(ImrDiemaking::class, 'id_kartu_instruksi_kerja');
    }

    public function imrFinishings()
    {
        return $this->hasMany(ImrFinishing::class, 'id_kartu_instruksi_kerja');
    }

    public function blokirs()
    {
        return $this->hasMany(Blokir::class, 'id_kartu_instruksi_kerja');
    }

    public function subcountOutItems()
    {
        return $this->hasMany(SubcountOutItem::class, 'id_kartu_instruksi_kerja');
    }


    public static function generateYearlySequentialId(): int
    {
        $currentYear = date('Y');

        $maxNumber = static::whereYear('created_at', $currentYear)
            ->selectRaw('MAX(CAST(SUBSTRING_INDEX(no_kartu_instruksi_kerja, "/", 1) AS UNSIGNED)) as max_number')
            ->value('max_number');

        return $maxNumber ? $maxNumber + 1 : 1;
    }
}
