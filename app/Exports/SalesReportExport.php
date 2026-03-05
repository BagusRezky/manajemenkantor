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
    protected $kode;
    private $rowNumber = 0;

    private $totalPendapatan = 0;
    private $totalTerbayar = 0;

    public function __construct($startDate, $endDate, $kode = null)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->kode = $kode;
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
            'suratJalan.salesOrder.customerAddress', // Fallback langsung ke SO
            'suratJalan.salesOrder.masterItem.unit', // Fallback langsung ke SO
            'suratJalan.salesOrder.suratJalans',     // Untuk hitung total qty kirim
            'bonPays'
        ])
        ->whereBetween('tgl_invoice', [$this->startDate, $this->endDate])
        ->when(!empty($this->kode), function ($query) {
            return $query->where('kode', 'LIKE', '%' . $this->kode . '%');
        })
        ->orderBy('tgl_invoice', 'asc')
        ->get();
    }

    public function map($invoice): array
    {
        $this->rowNumber++;

        // Variabel penentu alur data
        $sj = $invoice->suratJalan;
        $isFromKik = isset($sj->id_kartu_instruksi_kerja);

        // --- 1. Ambil Object SO & Item secara Fleksibel ---
        // Jika dari KIK, ambil SO lewat KIK. Jika tidak, ambil SO langsung dari SJ.
        $so = $isFromKik ? $sj->kartuInstruksiKerja->salesOrder : $sj->salesOrder;

        // Nama Barang: Dari Finish Good (KIK) atau Master Item (SO Langsung)
        $namaBarang = '-';
        $unitBarang = '-';
        if ($isFromKik) {
            $namaBarang = $so->finishGoodItem->nama_item ?? $so->finishGoodItem->nama_barang ?? '-';
            $unitBarang = $so->finishGoodItem->unit->kode_satuan ?? '-';
        } else {
            $namaBarang = $so->masterItem->nama_master_item ?? '-';
            $unitBarang = $so->masterItem->unit->kode_satuan ?? '-';
        }

        // --- 2. Perhitungan Nominal ---
        $nominalTotal = 0;
        if (!$invoice->is_legacy) {
            $qtyKirim = (float)($sj->qty_pengiriman ?? 0);
            $harga = (float)($so->harga_pcs_bp ?? 0);
            $subtotal = ($qtyKirim * $harga) - (float)($invoice->discount ?? 0);
            $ppnNominal = ($subtotal * (float)($invoice->ppn ?? 0)) / 100;
            $nominalTotal = $subtotal + $ppnNominal + (float)($invoice->ongkos_kirim ?? 0);
        } else {
            $nominalTotal = (float)$invoice->total;
        }

        // --- 3. Perhitungan Bayar & Status ---
        $totalCicilan = (float)$invoice->bonPays->sum('nominal_pembayaran');
        $uangMuka = $invoice->is_legacy ? 0 : (float)($invoice->uang_muka ?? 0);
        $sudahDibayar = $uangMuka + $totalCicilan;

        $this->totalPendapatan += $nominalTotal;
        $this->totalTerbayar += $sudahDibayar;

        $statusBayar = ($sudahDibayar >= ($nominalTotal - 1)) ? 'TERBAYAR' : 'PIUTANG';

        // --- 4. Keterangan Kirim (Partial/Terkirim) ---
        $totalAccumulatedQty = $so ? $so->suratJalans->sum('qty_pengiriman') : 0;
        $keteranganKirim = ($totalAccumulatedQty >= ($so->jumlah_pesanan ?? 0)) ? 'TERKIRIM' : 'TERKIRIM PARTIAL';

        // --- 5. Return Data Mapping ---
        if (!$invoice->is_legacy) {
            return [
                $this->rowNumber,
                $so->created_at ? $so->created_at->format('d/m/Y') : '-',
                $so->no_bon_pesanan ?? '-',
                $so->customerAddress->nama_customer ?? '-',
                $so->customerAddress->kode_customer ?? '-',
                $so->jumlah_pesanan ?? 0,
                $unitBarang,
                $isFromKik ? $sj->kartuInstruksiKerja->no_kartu_instruksi_kerja : '-',
                $namaBarang,
                $sj->tgl_surat_jalan ?? '-',
                $sj->qty_pengiriman ?? 0,
                $so->harga_pcs_bp ?? 0,
                $keteranganKirim,
                $sj->no_surat_jalan ?? '-',
                $invoice->no_invoice,
                $invoice->kode ?? '-',
                $nominalTotal,
                $statusBayar
            ];
        }

        // Data Legacy
        return [
            $this->rowNumber,
            '-',
            $invoice->no_so_lama,
            $invoice->customer_lama ?? 'Legacy',
            '-',
            '-',
            '-',
            $invoice->no_spk_lama,
            $invoice->keterangan,
            $invoice->tgl_invoice,
            '-',
            '-',
            'TERKIRIM',
            $invoice->no_surat_jalan_lama,
            $invoice->no_invoice,
            $invoice->kode ?? '-',
            $nominalTotal,
            $statusBayar
        ];
    }

    public function headings(): array
    {
        return [
            'NO', 'TGL TERBIT SO', 'NO. SO', 'CUSTOMER', 'KODE CUST', 'QTY ORDER', 'UNIT', 'SPK', 'NAMA ITEM', 'TGL KIRIM', 'JUMLAH KIRIM', 'HARGA SATUAN', 'KETERANGAN', 'NO. SURAT JALAN', 'NO. INVOICE', 'KODE', 'NOMINAL', 'KETERANGAN STATUS'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastRow = $sheet->getHighestRow();

                $sheet->setCellValue('A1', 'INDIGAMA KHATULISTIWA');
                $sheet->setCellValue('D1', 'ACTUAL REPORT');
                $sheet->setCellValue('D2', 'PERIODE ' . Carbon::parse($this->startDate)->format('Y'));
                $sheet->setCellValue('D3', 'JURNAL PENJUALAN ' . Carbon::parse($this->startDate)->format('m'));
                $sheet->mergeCells('A1:C1');
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
                $sheet->getStyle('D1:D3')->getFont()->setBold(true);

                $sheet->getStyle('A6:R6')->applyFromArray([
                    'font' => ['bold' => true],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E2E2E2']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                    'borders' => ['allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN]]
                ]);

                // Border untuk seluruh data
                $sheet->getStyle('A6:R' . $lastRow)->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

                // Summary di bawah tabel
                $summaryStartRow = $lastRow + 2;
                $sheet->setCellValue('O' . $summaryStartRow, 'TOTAL PENDAPATAN');
                $sheet->setCellValue('O' . ($summaryStartRow + 1), 'TERBAYAR');
                $sheet->setCellValue('O' . ($summaryStartRow + 2), 'TOTAL PIUTANG');

                $sheet->setCellValue('P' . $summaryStartRow, $this->totalPendapatan);
                $sheet->setCellValue('P' . ($summaryStartRow + 1), $this->totalTerbayar);
                $sheet->setCellValue('P' . ($summaryStartRow + 2), $this->totalPendapatan - $this->totalTerbayar);

                $sheet->getStyle('O' . $summaryStartRow . ':P' . ($summaryStartRow + 2))->getFont()->setBold(true);
                $sheet->getStyle('P' . $summaryStartRow . ':P' . ($summaryStartRow + 2))
                    ->getNumberFormat()->setFormatCode('#,##0');
            },
        ];
    }

    public function columnFormats(): array
    {
        return [
            'L' => '#,##0',
            'Q' => '#,##0', // Kolom Nominal adalah Q (kolom ke-17), bukan P
            'P' => '#,##0', // Kode biasanya angka murni
        ];
    }
}
