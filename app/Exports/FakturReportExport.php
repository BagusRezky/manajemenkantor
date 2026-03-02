<?php

namespace App\Exports;

use App\Models\TransFaktur;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class FakturReportExport implements FromCollection, WithEvents, ShouldAutoSize
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        $fakturs = TransFaktur::with(['details', 'purchaseOrder.supplier'])
            ->whereBetween('tanggal_transaksi', [$this->startDate, $this->endDate])
            ->orderBy('tanggal_transaksi', 'asc')
            ->get();

        $rows = [];

        // --- 1. HEADER PERUSAHAAN ---
        $rows[] = ['', '', '', '', 'CV. INDIGAMA KHATULISTIWA', '', '', '', '', '', 'LAPORAN FAKTUR'];
        $rows[] = ['', '', '', '', 'Jurangpelem Satu, Bulusari, Kec. Gempol, Pasuruan', '', '', '', '', '', ''];
        $rows[] = ['', '', '', '', '', '', '', '', '', 'Periode:', $this->startDate . ' s/d ' . $this->endDate];
        $rows[] = ['', 'Email : indigama.khatulistiwa01@gmail.com'];
        $rows[] = ['', 'Telp. 08131361056'];
        $rows[] = []; // Spacer

        foreach ($fakturs as $faktur) {
            $vendorName = $faktur->purchaseOrder->supplier->nama_suplier ?? 'N/A';
            $noPo = $faktur->purchaseOrder->no_po ?? $faktur->no_po_asal;

            // --- 2. DATA HEADER FAKTUR ---
            $rows[] = ['', 'No Faktur', ': ' . $faktur->no_faktur];
            $rows[] = ['', 'Vendor', ': ' . $vendorName];
            $rows[] = ['', 'No PO', ': ' . $noPo];
            $rows[] = ['', 'NPWP', ': ' . $faktur->npwp];
            $rows[] = ['', 'Alamat', ': ' . $faktur->alamat];
            $rows[] = ['', 'Note', ': ' . ($faktur->keterangan ?? '-')];
            $rows[] = []; // Spacer sebelum tabel item

            // --- 3. TABLE COLUMN HEADERS (Indeks Baris ini akan di-style nanti) ---
            $rows[] = [
                '', 'Tgl', 'Group', 'Product', '', '', '', '', 'Qty', 'Satuan', 'Harga', 'Disc', 'Total', 'PPN %', 'PPN Nilai', 'Total Akhir'
            ];

            // --- 4. DETAIL ITEMS ---
            foreach ($faktur->details as $detail) {
                $rows[] = [
                    '',
                    $faktur->tanggal_transaksi,
                    $detail->group ?? '-',
                    $detail->master_item,
                    '', '', '', '', // Padding kolom agar Qty pas di I
                    $detail->qty,
                    $detail->unit,
                    $detail->harga_per_qty,
                    $detail->discount ?? 0,
                    $detail->subtotal,
                    $detail->ppn_persen,
                    $detail->ppn_nilai,
                    $detail->total_item
                ];
            }

            // --- 5. TOTAL PER FAKTUR ---
            $rows[] = ['', '', '', '', '', '', '', '', '', 'TOTAL', '', '', $faktur->total_dpp, '', '', $faktur->grand_total];
            $rows[] = []; // Spacer besar antar faktur
            $rows[] = [];
        }

        return collect($rows);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $highestRow = $sheet->getHighestRow();

                // --- STYLING GLOBAL ---
                $sheet->getStyle('A1:P' . $highestRow)->getFont()->setName('Arial')->setSize(10);

                // --- STYLING HEADER PERUSAHAAN ---
                $sheet->getStyle('E1')->getFont()->setBold(true)->setSize(14);
                $sheet->getStyle('K1')->getFont()->setBold(true)->setSize(14);
                $sheet->getStyle('B1:B' . $highestRow)->getFont()->setBold(true); // Label kiri bold

                // --- LOOPING UNTUK MENCARI BARIS TABEL & APPLY BORDER ---
                for ($i = 1; $i <= $highestRow; $i++) {
                    $cellValue = $sheet->getCell('B' . $i)->getValue();

                    // Style Header Tabel Item (Baris yang kolom B-nya berisi "Tgl")
                    if ($cellValue == 'Tgl') {
                        $range = 'B' . $i . ':P' . $i;
                        $sheet->getStyle($range)->applyFromArray([
                            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                            'fill' => [
                                'fillType' => Fill::FILL_SOLID,
                                'startColor' => ['rgb' => '444444'] // Abu-abu gelap
                            ],
                            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                            'borders' => [
                                'allBorders' => ['borderStyle' => Border::BORDER_THIN],
                            ],
                        ]);
                    }

                    // Style Row Total (Baris yang kolom J-nya berisi "TOTAL")
                    if ($sheet->getCell('J' . $i)->getValue() == 'TOTAL') {
                        $range = 'J' . $i . ':P' . $i;
                        $sheet->getStyle($range)->getFont()->setBold(true);
                        $sheet->getStyle($range)->applyFromArray([
                            'borders' => [
                                'top' => ['borderStyle' => Border::BORDER_DOUBLE],
                                'bottom' => ['borderStyle' => Border::BORDER_THIN],
                            ],
                        ]);
                    }
                }

                // --- FORMATTING ANGKA & ALIGNMENT ---
                // Format ribuan (1.000.000) untuk kolom Harga (K), Total (M), PPN Nilai (O), Total Akhir (P)
                $sheet->getStyle('K1:P' . $highestRow)->getNumberFormat()->setFormatCode('#,##0');
                $sheet->getStyle('I1:I' . $highestRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // Qty Tengah
                $sheet->getStyle('K1:P' . $highestRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT); // Angka Kanan
            },
        ];
    }
}
