<?php

namespace App\Exports;

use App\Models\Invoice;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Carbon\Carbon;

class SalesReportExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithColumnFormatting,
    ShouldAutoSize,
    WithEvents,
    WithCustomStartCell
{
    protected $startDate;
    protected $endDate;
    private $rowNumber = 0;

    // Variabel penampung total untuk Summary
    private $totalPendapatan = 0;
    private $totalTerbayar = 0;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function startCell(): string
    {
        return 'A6';
    }

    public function collection()
    {
        return Invoice::with([
            'suratJalan.kartuInstruksiKerja.salesOrder.customerAddress',
            'suratJalan.kartuInstruksiKerja.salesOrder.finishGoodItem.unit',
            'suratJalan.kartuInstruksiKerja.salesOrder.suratJalans',
            'bonPays'
        ])
        ->whereBetween('tgl_invoice', [$this->startDate, $this->endDate])
        ->orderBy('tgl_invoice', 'asc')
        ->get();
    }

    public function map($invoice): array
    {
        $this->rowNumber++;

        // 1. Hitung Nominal Total (Pendapatan)
        $nominalTotal = 0;
        if (!$invoice->is_legacy) {
            $sj = $invoice->suratJalan;
            $so = $sj->kartuInstruksiKerja->salesOrder ?? null;
            $qtyKirim = (float)($sj->qty_pengiriman ?? 0);
            $harga = (float)($so->harga_pcs_bp ?? 0);
            $subtotal = ($qtyKirim * $harga) - (float)($invoice->discount ?? 0);
            $ppnNominal = ($subtotal * (float)($invoice->ppn ?? 0)) / 100;
            $nominalTotal = $subtotal + $ppnNominal + (float)($invoice->ongkos_kirim ?? 0);
        } else {
            $nominalTotal = (float)$invoice->total;
        }

        // 2. Hitung Total Terbayar (DP + Bon Pay)
        $totalCicilan = (float)$invoice->bonPays->sum('nominal_pembayaran');
        $uangMuka = $invoice->is_legacy ? 0 : (float)($invoice->uang_muka ?? 0);
        $sudahDibayar = $uangMuka + $totalCicilan;

        // Akumulasi ke variabel class untuk summary di bawah
        $this->totalPendapatan += $nominalTotal;
        $this->totalTerbayar += $sudahDibayar;

        // 3. Penentuan Status
        $statusBayar = ($sudahDibayar >= ($nominalTotal - 1)) ? 'TERBAYAR' : 'PIUTANG';

        // Mapping Kolom Excel
        if (!$invoice->is_legacy) {
            $so = $invoice->suratJalan->kartuInstruksiKerja->salesOrder;
            $item = $so->finishGoodItem;
            $totalAccumulatedQty = $so ? $so->suratJalans->sum('qty_pengiriman') : 0;
            $keteranganKirim = ($totalAccumulatedQty >= ($so->jumlah_pesanan ?? 0)) ? 'TERKIRIM' : 'TERKIRIM PARTIAL';

            return [
                $this->rowNumber,
                $so->created_at ? $so->created_at->format('d/m/Y') : '-',
                $so->no_bon_pesanan ?? '-',
                $so->customerAddress->nama_customer ?? '-',
                $so->customerAddress->kode_customer ?? '-',
                $so->jumlah_pesanan ?? 0,
                $item->unit->kode_satuan ?? '-',
                $invoice->suratJalan->kartuInstruksiKerja->no_kartu_instruksi_kerja ?? '-',
                $item->nama_item ?? $item->nama_barang ??'-',
                $invoice->suratJalan->tgl_surat_jalan ?? '-',
                $invoice->suratJalan->qty_pengiriman ?? 0,
                $so->harga_pcs_bp ?? 0,
                $keteranganKirim,
                $invoice->suratJalan->no_surat_jalan ?? '-',
                $invoice->no_invoice,
                $nominalTotal,
                $statusBayar
            ];
        }

        return [
            $this->rowNumber, '-', $invoice->no_so_lama, $invoice->surat_jalan->kartu_instruksi_kerja->sales_order->customer_address->nama_customer ?? 'Legacy', '-', '-', '-', $invoice->no_spk_lama, $invoice->keterangan, $invoice->tgl_invoice, '-', '-', 'TERKIRIM', $invoice->no_surat_jalan_lama, $invoice->no_invoice, $nominalTotal, $statusBayar
        ];
    }

    public function headings(): array
    {
        return [
            'NO', 'TGL TERBIT SO', 'NO. SO', 'CUSTOMER', 'KODE CUST', 'QTY ORDER', 'UNIT', 'SPK', 'NAMA ITEM', 'TGL KIRIM', 'JUMLAH KIRIM', 'HARGA SATUAN', 'KETERANGAN', 'NO. SURAT JALAN', 'NO. INVOICE', 'NOMINAL', 'KETERANGAN STATUS'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastRow = $sheet->getHighestRow();

                // --- 1. HEADER & JUDUL (Sama seperti sebelumnya) ---
                $sheet->setCellValue('A1', 'INDIGAMA KHATULISTIWA');
                $sheet->setCellValue('D1', 'ACTUAL REPORT');
                $sheet->setCellValue('D2', 'PERIODE ' . Carbon::parse($this->startDate)->format('Y'));
                $sheet->setCellValue('D3', 'JURNAL PENJUALAN ' . Carbon::parse($this->startDate)->format('m'));
                $sheet->mergeCells('A1:C1');
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
                $sheet->getStyle('D1:D3')->getFont()->setBold(true);
                $sheet->getStyle('A6:Q6')->applyFromArray([
                    'font' => ['bold' => true],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E2E2E2']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                    'borders' => ['allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN]]
                ]);
                $sheet->getStyle('A6:Q' . $lastRow)->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

                // --- 2. SUMMARY (TOTAL PENDAPATAN, TERBAYAR, PIUTANG) ---
                $summaryStartRow = $lastRow + 2;

                // Labels di kolom O
                $sheet->setCellValue('O' . $summaryStartRow, 'TOTAL PENDAPATAN');
                $sheet->setCellValue('O' . ($summaryStartRow + 1), 'TERBAYAR');
                $sheet->setCellValue('O' . ($summaryStartRow + 2), 'TOTAL PIUTANG');

                // Values di kolom P
                $sheet->setCellValue('P' . $summaryStartRow, $this->totalPendapatan);
                $sheet->setCellValue('P' . ($summaryStartRow + 1), $this->totalTerbayar);
                $sheet->setCellValue('P' . ($summaryStartRow + 2), $this->totalPendapatan - $this->totalTerbayar);

                // Styling Summary
                $styleSummary = [
                    'font' => ['bold' => true],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_RIGHT],
                ];
                $sheet->getStyle('O' . $summaryStartRow . ':P' . ($summaryStartRow + 2))->applyFromArray($styleSummary);

                // Format ribuan untuk nilai summary
                $sheet->getStyle('P' . $summaryStartRow . ':P' . ($summaryStartRow + 2))
                    ->getNumberFormat()
                    ->setFormatCode('#,##0');
            },
        ];
    }

    public function columnFormats(): array
    {
        return [
            'L' => '#,##0',
            'P' => '#,##0',
        ];
    }
}
