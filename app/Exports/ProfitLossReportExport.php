<?php

namespace App\Exports;

use App\Models\Invoice;
use App\Models\OperasionalPay;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Illuminate\Support\Collection;

class ProfitLossReportExport implements FromCollection, ShouldAutoSize, WithEvents
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
        return new Collection();
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // --- 1. HEADER ---
                $sheet->setCellValue('A1', 'CV. Indigama Khatulistiwa');
                $sheet->setCellValue('A2', 'LABA RUGI (Global)');
                $sheet->setCellValue('A3', 'Periode: ' . $this->startDate . ' s/d ' . $this->endDate);
                $sheet->getStyle('A1:A2')->getFont()->setBold(true)->setSize(12);

                $currentRow = 5;

                // --- 2. SEKSI PENDAPATAN ---
                $sheet->setCellValue('A' . $currentRow, 'Pendapatan');
                $sheet->getStyle('A' . $currentRow)->getFont()->setBold(true)->setUnderline(true);
                $currentRow++;

                // Header Tabel Pendapatan
                $sheet->setCellValue("A$currentRow", "KATEGORI");
                $sheet->setCellValue("B$currentRow", "NAMA ITEM");
                $sheet->setCellValue("C$currentRow", "KODE");
                $sheet->setCellValue("D$currentRow", "Rp");
                $sheet->setCellValue("E$currentRow", "DEBIT");
                $sheet->setCellValue("F$currentRow", "Rp");
                $sheet->setCellValue("G$currentRow", "KREDIT");
                $sheet->getStyle("A$currentRow:G$currentRow")->getFont()->setBold(true);
                $sheet->getStyle("A$currentRow:G$currentRow")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $currentRow++;

                // Eager Load relasi yang sudah kita update (direct salesOrder)
                $invoices = Invoice::with([
                    'suratJalan.kartuInstruksiKerja.salesOrder.finishGoodItem.typeItem.categoryItem',
                    'suratJalan.salesOrder.masterItem.categoryItem', // Tambahan Fallback
                    'bonPays'
                ])->whereBetween('tgl_invoice', [$this->startDate, $this->endDate])->get();

                $groupedSales = [];
                $totalPendapatanVal = 0;
                $totalPiutangVal = 0;

                foreach ($invoices as $inv) {
                    $nominal = 0;
                    $itemCode = 'LEGACY';
                    $itemName = $inv->keterangan ?? 'Data Legacy';
                    $categoryName = 'LAIN-LAIN';

                    if (!$inv->is_legacy && $inv->suratJalan) {
                        $sj = $inv->suratJalan;
                        // LOGIK BARU: Cek KIK dulu, kalau null ambil SO langsung dari SJ
                        $so = $sj->id_kartu_instruksi_kerja ? $sj->kartuInstruksiKerja->salesOrder : $sj->salesOrder;

                        if ($so) {
                            // Cek apakah SO untuk MasterItem atau FinishGoodItem
                            if ($so->id_master_item && $so->masterItem) {
                                $itemCode = $so->masterItem->kode_master_item;
                                $itemName = $so->masterItem->nama_master_item;
                                $categoryName = $so->masterItem->categoryItem->nama_category_item ?? 'UMUM';
                            } elseif ($so->id_finish_good_item && $so->finishGoodItem) {
                                $itemCode = $so->finishGoodItem->kode_material_produk;
                                $itemName = $so->finishGoodItem->nama_barang;
                                $categoryName = $so->finishGoodItem->typeItem->categoryItem->nama_category_item ?? 'BARANG JADI';
                            }

                            // Perhitungan Nominal (Harga * Qty SJ)
                            $qty = (float)($sj->qty_pengiriman ?? 0);
                            $harga = (float)($so->harga_pcs_bp ?? 0);
                            $subtotal = ($qty * $harga) - (float)($inv->discount ?? 0);
                            $ppnNominal = ($subtotal * (float)($inv->ppn ?? 0)) / 100;
                            $nominal = $subtotal + $ppnNominal + (float)($inv->ongkos_kirim ?? 0);
                        }
                    } else {
                        $nominal = (float)$inv->total;
                    }

                    $totalPendapatanVal += $nominal;
                    $sudahDibayar = ($inv->is_legacy ? 0 : (float)($inv->uang_muka ?? 0)) + (float)$inv->bonPays->sum('nominal_pembayaran');
                    $totalPiutangVal += ($nominal - $sudahDibayar);

                    $key = $categoryName . $itemName;
                    if (!isset($groupedSales[$key])) {
                        $groupedSales[$key] = ['cat' => $categoryName, 'name' => $itemName, 'code' => $itemCode, 'total' => 0];
                    }
                    $groupedSales[$key]['total'] += $nominal;
                }

                foreach ($groupedSales as $sale) {
                    $sheet->setCellValue("A$currentRow", $sale['cat']);
                    $sheet->setCellValue("B$currentRow", $sale['name']);
                    $sheet->setCellValue("C$currentRow", $sale['code']);
                    $sheet->setCellValue("D$currentRow", "Rp");
                    $sheet->setCellValue("E$currentRow", $sale['total']);
                    $sheet->setCellValue("F$currentRow", "Rp");
                    $sheet->setCellValue("G$currentRow", "0.00");
                    $currentRow++;
                }

                $sheet->setCellValue("A$currentRow", "Total Pendapatan");
                $sheet->setCellValue("E$currentRow", $totalPendapatanVal);
                $sheet->getStyle("A$currentRow:E$currentRow")->getFont()->setBold(true);
                $currentRow += 2;

                // --- 3. SEKSI PIUTANG ---
                $sheet->setCellValue('A' . $currentRow, 'Kredit Customer Belum Terbayar');
                $sheet->getStyle('A' . $currentRow)->getFont()->setBold(true)->setUnderline(true);
                $currentRow++;
                $sheet->setCellValue("A$currentRow", "KREDIT");
                $sheet->setCellValue("B$currentRow", "SISA KREDIT CUSTOMER");
                $sheet->setCellValue("D$currentRow", "Rp"); $sheet->setCellValue("E$currentRow", "0.00");
                $sheet->setCellValue("F$currentRow", "Rp"); $sheet->setCellValue("G$currentRow", $totalPiutangVal);
                $currentRow++;
                $sheet->setCellValue("A$currentRow", "Total Kredit Customer Belum Terbayar");
                $sheet->setCellValue("G$currentRow", $totalPiutangVal);
                $sheet->getStyle("A$currentRow:G$currentRow")->getFont()->setBold(true);
                $currentRow += 2;

                // --- 4. SEKSI BEBAN ---
                $sheet->setCellValue('A' . $currentRow, 'Beban Biaya');
                $sheet->getStyle('A' . $currentRow)->getFont()->setBold(true)->setUnderline(true);
                $currentRow++;

                $totalBebanVal = 0;
                $ops = OperasionalPay::with('accountBeban')
                    ->whereBetween('tanggal_transaksi', [$this->startDate, $this->endDate])
                    ->get()
                    ->groupBy('id_account_beban');

                foreach ($ops as $items) {
                    $first = $items->first();
                    $sheet->setCellValue("A$currentRow", $first->accountBeban->kode_akuntansi ?? '-');
                    $sheet->setCellValue("B$currentRow", $first->accountBeban->nama_akun ?? '-');
                    $sheet->setCellValue("D$currentRow", "Rp"); $sheet->setCellValue("E$currentRow", "0.00");
                    $sheet->setCellValue("F$currentRow", "Rp"); $sheet->setCellValue("G$currentRow", $items->sum('nominal'));
                    $totalBebanVal += $items->sum('nominal'); $currentRow++;
                }

                $sheet->setCellValue("A$currentRow", "Total Beban Biaya");
                $sheet->setCellValue("G$currentRow", $totalBebanVal);
                $sheet->getStyle("A$currentRow:G$currentRow")->getFont()->setBold(true);
                $currentRow += 2;

                // --- 5. FINAL LABA RUGI ---
                $sheet->mergeCells("A$currentRow:F$currentRow");
                $sheet->setCellValue("A$currentRow", "LABA / RUGI BERSIH");
                $sheet->setCellValue("G$currentRow", $totalPendapatanVal - $totalBebanVal);
                $sheet->getStyle("A$currentRow:G$currentRow")->getFont()->setBold(true)->setSize(12);

                // --- STYLING ---
                $sheet->getStyle("E5:G$currentRow")->getNumberFormat()->setFormatCode('#,##0.00');
                $sheet->getStyle("A5:G$currentRow")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
            },
        ];
    }
}
