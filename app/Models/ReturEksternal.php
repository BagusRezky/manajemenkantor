<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class ReturEksternal extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_penerimaan_barang',
        'no_retur',
        'tgl_retur_barang',
        'nama_retur',
        'catatan_retur',
    ];

    public function penerimaanBarang()
    {
        return $this->belongsTo(PenerimaanBarang::class, 'id_penerimaan_barang');
    }
    public function items()
    {
        return $this->hasMany(ReturEksternalItem::class, 'id_retur_eksternal');
    }

    public function getNoLaporanBarangAttribute()
    {
        return $this->penerimaanBarang->no_laporan_barang ?? null;
    }

    // ✅ TAMBAH: Method untuk generate nomor retur
    public static function generateNoRetur(): string
    {
        // Get latest retur with current year and month
        $currentYear = date('Y');
        $currentMonth = date('m');
        $prefix = "RTR-{$currentYear}.{$currentMonth}-";

        // Get the latest retur with the same year-month prefix
        $latestRetur = static::where('no_retur', 'like', $prefix . '%')
            ->orderBy('no_retur', 'desc')
            ->first();

        if ($latestRetur) {
            // Extract the number part and increment
            $lastNumber = (int) substr($latestRetur->no_retur, -6);
            $nextNumber = $lastNumber + 1;
        } else {
            // First retur of the month
            $nextNumber = 1;
        }

        // Format with 6 digits padding
        $formattedNumber = str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

        return $prefix . $formattedNumber;
    }
}
