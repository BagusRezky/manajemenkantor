<?php

namespace App\Exports;

use App\Models\DieMaking;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class DieMakingWasteExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function query()
    {
        return DieMaking::query()
            ->with(['kartuInstruksiKerja', 'erorProduction'])
            ->whereBetween('tanggal_entri', [$this->startDate, $this->endDate])
            ->where('hasil_rusak_diemaking', '>', 0)
            ->orderBy('tanggal_entri', 'asc');
    }

    public function headings(): array
    {
        return [
            'No. SPK',
            'Kode Divisi',
            'Satuan',
            'Tanggal Entri',
            'Qty Hasil Rusak',
            'Note Waste / Error',
        ];
    }

    public function map($dieMaking): array
    {
        return [
            $dieMaking->kartuInstruksiKerja->no_kartu_instruksi_kerja ?? '-',
            $dieMaking->kode_diemaking,
            'PCS',
            $dieMaking->tanggal_entri,
            $dieMaking->hasil_rusak_diemaking,
            $dieMaking->erorProduction->nama_eror ?? '-',
        ];
    }
}
