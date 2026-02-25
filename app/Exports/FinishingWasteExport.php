<?php

namespace App\Exports;

use App\Models\Finishing;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class FinishingWasteExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
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
        return Finishing::query()
            ->with(['kartuInstruksiKerja', 'erorProduction'])
            ->whereBetween('tanggal_entri', [$this->startDate, $this->endDate])
            ->where('hasil_rusak_finishing', '>', 0)
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

    public function map($finishing): array
    {
        return [
            $finishing->kartuInstruksiKerja->no_kartu_instruksi_kerja ?? '-',
            $finishing->kode_finishing,
            'PCS',
            $finishing->tanggal_entri,
            $finishing->hasil_rusak_finishing,
            $finishing->erorProduction->nama_eror ?? '-',
        ];
    }
}
