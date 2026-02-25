<?php

namespace App\Exports;

use App\Models\PenerimaanBarangItem;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PoPbExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $startDate;
    protected $endDate;
    private $rowNumber = 0;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function query()
    {
        // Kita mulai dari PenerimaanBarangItem untuk mendapatkan detail per penerimaan
        return PenerimaanBarangItem::query()
            ->with([
                'penerimaanBarang',
                'purchaseOrderItem.purchaseOrder',
                'purchaseOrderItem.masterItem.typeItem',
                'purchaseOrderItem.satuan'
            ])
            ->whereHas('penerimaanBarang', function ($q) {
                $q->whereBetween('tgl_terima_barang', [$this->startDate, $this->endDate]);
            })
            ->orderBy(
                'id_penerimaan_barang', 'asc'
            );
    }

    public function headings(): array
    {
        return [
            'NO',
            'TGL. PO',
            'NO. PO',
            'NO. LPB',
            'TGL. LPB',
            'KODE ITEM',
            'NAMA ITEM',
            'QTY PO',
            'SATUAN PO',
            'QTY LPB',
            'SATUAN LPB',
            'NO. SURAT JALAN',
            'TIPE ITEM',
        ];
    }

    public function map($item): array
    {
        $this->rowNumber++;

        $poItem = $item->purchaseOrderItem;
        $poHeader = $poItem->purchaseOrder ?? null;
        $pbHeader = $item->penerimaanBarang ?? null;

        return [
            $this->rowNumber,
            $poHeader ? $poHeader->tanggal_po->format('d-m-Y') : '-',
            $poHeader->no_po ?? '-',
            $pbHeader->no_laporan_barang ?? '-',
            $pbHeader ? \Carbon\Carbon::parse($pbHeader->tgl_terima_barang)->format('d-m-Y') : '-',
            $poItem->masterItem->kode_master_item ?? '-',
            $poItem->masterItem->nama_master_item ?? '-',
            $poItem->qty_po ?? 0,
            $poItem->satuan->nama_satuan ?? '-',
            $item->qty_penerimaan ?? 0,
            $poItem->satuan->nama_satuan ?? '-',
            $pbHeader->no_surat_jalan ?? '-',
            $poItem->masterItem->typeItem->nama_type_item ?? '-',
        ];
    }
}
