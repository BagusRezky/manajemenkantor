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


     public static function generateYearlySequentialId(): int
    {
        $currentYear = date('Y');

        // Count records from the current year and add 1
        return static::whereYear('created_at', $currentYear)->count() + 1;
    }
}
