<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;

class ImrFinishing extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_kartu_instruksi_kerja',
        'no_imr_finishing',
        'tgl_request',
        'status',
    ];

    public function kartuInstruksiKerja()
    {
        return $this->belongsTo(KartuInstruksiKerja::class, 'id_kartu_instruksi_kerja');
    }
    public function items()
    {
        return $this->hasMany(ImrFinishingItem::class, 'id_imr_finishing');
    }

    public static function generateNoImr()
    {
        try {
            $year = now()->format('Y'); // Format: 2025
            $month = now()->format('m'); // Format: 06
            $yearMonth = $year . $month; // Format: 202506
            $prefix = 'IMR-' . $yearMonth;

            // Cari nomor terakhir tahun ini (tidak reset per bulan)
            $lastImr = self::where('no_imr_finishing', 'LIKE', 'IMR-' . $year . '%.%')
                ->orderBy('no_imr_finishing', 'desc')
                ->first();

            if ($lastImr) {
                // Ambil 4 digit terakhir setelah titik dan tambah 1
                $lastPart = substr($lastImr->no_imr_finishing, strpos($lastImr->no_imr_finishing, '.') + 1);
                $lastNumber = (int) $lastPart;
                $newNumber = $lastNumber + 1;
            } else {
                // Mulai dari 1 jika belum ada
                $newNumber = 1;
            }

            // Format dengan 4 digit: 0001, 0002, dst
            $formattedNumber = str_pad($newNumber, 4, '0', STR_PAD_LEFT);

            $noImr = $prefix . '.' . $formattedNumber;

            Log::info('Generated IMR number:', [
                'prefix' => $prefix,
                'last_number' => $lastImr ? $lastNumber : 0,
                'new_number' => $newNumber,
                'final_no_imr' => $noImr
            ]);

            return $noImr;
        } catch (\Exception $e) {
            Log::error('Error generating IMR number:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
