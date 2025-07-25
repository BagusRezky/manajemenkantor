<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class KartuInstruksiKerjaBom extends Model
{
     use HasFactory;

    protected $fillable = [
        'id_kartu_instruksi_kerja',
        'id_bom',
        'waste',
        'total_kebutuhan',
        'jumlah_sheet_cetak',
        'jumlah_total_sheet_cetak',
        'jumlah_produksi',
    ];

    public function kartuInstruksiKerja()
    {
        return $this->belongsTo(KartuInstruksiKerja::class, 'id_kartu_instruksi_kerja');
    }

    public function billOfMaterials()
    {
        return $this->belongsTo(BillOfMaterial::class, 'id_bom');
    }

    public function internalMaterialRequestItems()
    {
        return $this->hasMany(InternalMaterialRequestItem::class, 'id_kartu_instruksi_kerja_bom');
    }

    public function imrDiemakingItems()
    {
        return $this->hasMany(ImrDiemakingItem::class, 'id_kartu_instruksi_kerja_bom');
    }

    public function imrFinishingItems()
    {
        return $this->hasMany(ImrFinishingItem::class, 'id_kartu_instruksi_kerja_bom');
    }
}
