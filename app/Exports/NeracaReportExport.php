<?php

namespace App\Exports;

use App\Models\Invoice;
use App\Models\MasterCoa;
use App\Models\BonPay;
use App\Models\TransKas;
use App\Models\TransKasBank;
use App\Models\OperasionalPay;
use App\Models\PoBilling;
use App\Models\TransPaymentDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class NeracaReportExport implements FromCollection, ShouldAutoSize, WithEvents
{
    protected $tanggal;

    public function __construct($tanggal)
    {
        // Tanggal cut-off neraca, misal: '2026-03-31'
        $this->tanggal = $tanggal;
    }

    public function collection()
    {
        return new Collection();
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // ============================================================
                // AMBIL SEMUA DATA COA
                // ============================================================
                $allCoas = MasterCoa::orderBy('kode_akuntansi')->get()->keyBy('id');

                // ============================================================
                // HITUNG SALDO PER COA (Agregasi dari semua tabel transaksi)
                // ============================================================
                $saldos = $this->hitungSaldoSemuaCoa($allCoas);

                // ============================================================
                // GROUPING COA KE KATEGORI NERACA
                // ============================================================

                // ASET
                $kasSetaraKas        = $this->filterByRange($saldos, $allCoas, '101.001', '101.103');
                $piutangUsaha        = $this->filterByRange($saldos, $allCoas, '101.201', '101.203');
                $persediaan          = $this->filterByRange($saldos, $allCoas, '101.301', '101.304');
                $asetLancarLainnya   = $this->filterByRange($saldos, $allCoas, '101.401', '101.602');
                $asetTidakLancar     = $this->filterByRange($saldos, $allCoas, '102.001', '102.403');
                $asetTidakBerwujud   = $this->filterByRange($saldos, $allCoas, '103.101', '103.301');

                // KEWAJIBAN
                $kewajibanJangkaPanjang = $this->filterByRange($saldos, $allCoas, '201.001', '201.102');
                $kewajibanJangkaPendek  = $this->filterByRange($saldos, $allCoas, '201.101', '210.202');

                // EKUITAS
                $ekuitas = $this->filterByRange($saldos, $allCoas, '301.001', '301.105');

                // Laba berjalan (dari laba rugi) dimasukkan ke ekuitas
                $labaBerjalan = $this->hitungLabaBerjalan($allCoas);

                // ============================================================
                // TOTAL KALKULASI
                // ============================================================
                $totalAsetLancar     = array_sum(array_column($kasSetaraKas, 'saldo'))
                                     + array_sum(array_column($piutangUsaha, 'saldo'))
                                     + array_sum(array_column($persediaan, 'saldo'))
                                     + array_sum(array_column($asetLancarLainnya, 'saldo'));

                $totalAsetTidakLancar    = array_sum(array_column($asetTidakLancar, 'saldo'));
                $totalAsetTidakBerwujud  = array_sum(array_column($asetTidakBerwujud, 'saldo'));
                $totalAset               = $totalAsetLancar + $totalAsetTidakLancar + $totalAsetTidakBerwujud;

                $totalKewJangkaPanjang = array_sum(array_column($kewajibanJangkaPanjang, 'saldo'));
                $totalKewJangkaPendek  = array_sum(array_column($kewajibanJangkaPendek, 'saldo'));
                $totalKewajiban        = $totalKewJangkaPanjang + $totalKewJangkaPendek;

                $totalEkuitas          = array_sum(array_column($ekuitas, 'saldo')) + $labaBerjalan;

                $totalKewajibanEkuitas = $totalKewajiban + $totalEkuitas;

                // ============================================================
                // RENDER KE EXCEL
                // ============================================================
                $row = 1;

                // --- HEADER ---
                $sheet->mergeCells("A{$row}:E{$row}");
                $sheet->setCellValue("A{$row}", 'CV. INDIGAMA KHATULISTIWA');
                $sheet->getStyle("A{$row}")->getFont()->setBold(true)->setSize(14);
                $row++;

                $sheet->mergeCells("A{$row}:E{$row}");
                $sheet->setCellValue("A{$row}", 'NERACA (BALANCE SHEET)');
                $sheet->getStyle("A{$row}")->getFont()->setBold(true)->setSize(12);
                $row++;

                $sheet->mergeCells("A{$row}:E{$row}");
                $sheet->setCellValue("A{$row}", 'Per Tanggal: ' . \Carbon\Carbon::parse($this->tanggal)->translatedFormat('d F Y'));
                $sheet->getStyle("A{$row}")->getFont()->setItalic(true);
                $row += 2; // spasi

                // ============================================================
                // SECTION: ASET
                // ============================================================
                $row = $this->renderSectionHeader($sheet, $row, 'A S E T');

                // Aset Lancar
                $row = $this->renderSubHeader($sheet, $row, 'Aset Lancar');
                $row = $this->renderSubSubHeader($sheet, $row, 'Kas dan Setara Kas');
                $row = $this->renderRows($sheet, $row, $kasSetaraKas);
                $row = $this->renderSubTotal($sheet, $row, 'Jumlah Kas dan Setara Kas', array_sum(array_column($kasSetaraKas, 'saldo')));

                $row = $this->renderSubSubHeader($sheet, $row, 'Piutang Usaha');
                $row = $this->renderRows($sheet, $row, $piutangUsaha);
                $row = $this->renderSubTotal($sheet, $row, 'Jumlah Piutang Usaha', array_sum(array_column($piutangUsaha, 'saldo')));

                $row = $this->renderSubSubHeader($sheet, $row, 'Persediaan');
                $row = $this->renderRows($sheet, $row, $persediaan);
                $row = $this->renderSubTotal($sheet, $row, 'Jumlah Persediaan', array_sum(array_column($persediaan, 'saldo')));

                $row = $this->renderSubSubHeader($sheet, $row, 'Aset Lancar Lainnya');
                $row = $this->renderRows($sheet, $row, $asetLancarLainnya);
                $row = $this->renderSubTotal($sheet, $row, 'Jumlah Aset Lancar Lainnya', array_sum(array_column($asetLancarLainnya, 'saldo')));

                $row = $this->renderTotal($sheet, $row, 'JUMLAH ASET LANCAR', $totalAsetLancar, 'D4E6F1');
                $row++;

                // Aset Tidak Lancar
                $row = $this->renderSubHeader($sheet, $row, 'Aset Tidak Lancar');
                $row = $this->renderRows($sheet, $row, $asetTidakLancar);
                $row = $this->renderTotal($sheet, $row, 'JUMLAH ASET TIDAK LANCAR', $totalAsetTidakLancar, 'D4E6F1');
                $row++;

                // Aset Tidak Berwujud
                $row = $this->renderSubHeader($sheet, $row, 'Aset Tidak Berwujud');
                $row = $this->renderRows($sheet, $row, $asetTidakBerwujud);
                $row = $this->renderTotal($sheet, $row, 'JUMLAH ASET TIDAK BERWUJUD', $totalAsetTidakBerwujud, 'D4E6F1');
                $row++;

                // GRAND TOTAL ASET
                $row = $this->renderGrandTotal($sheet, $row, 'JUMLAH SELURUH ASET', $totalAset);
                $row += 2;

                // ============================================================
                // SECTION: KEWAJIBAN
                // ============================================================
                $row = $this->renderSectionHeader($sheet, $row, 'K E W A J I B A N');

                // Kewajiban Jangka Panjang
                $row = $this->renderSubHeader($sheet, $row, 'Kewajiban Jangka Panjang');
                $row = $this->renderRows($sheet, $row, $kewajibanJangkaPanjang);
                $row = $this->renderTotal($sheet, $row, 'JUMLAH KEWAJIBAN JANGKA PANJANG', $totalKewJangkaPanjang, 'FADBD8');
                $row++;

                // Kewajiban Jangka Pendek
                $row = $this->renderSubHeader($sheet, $row, 'Kewajiban Jangka Pendek');
                $row = $this->renderRows($sheet, $row, $kewajibanJangkaPendek);
                $row = $this->renderTotal($sheet, $row, 'JUMLAH KEWAJIBAN JANGKA PENDEK', $totalKewJangkaPendek, 'FADBD8');
                $row++;

                // GRAND TOTAL KEWAJIBAN
                $row = $this->renderGrandTotal($sheet, $row, 'JUMLAH SELURUH KEWAJIBAN', $totalKewajiban);
                $row += 2;

                // ============================================================
                // SECTION: EKUITAS
                // ============================================================
                $row = $this->renderSectionHeader($sheet, $row, 'E K U I T A S');
                $row = $this->renderRows($sheet, $row, $ekuitas);

                // Laba Berjalan
                $sheet->setCellValue("B{$row}", '   Laba / Rugi Berjalan');
                $sheet->setCellValue("D{$row}", $labaBerjalan >= 0 ? $labaBerjalan : 0);
                $sheet->setCellValue("E{$row}", $labaBerjalan < 0 ? abs($labaBerjalan) : 0);
                $sheet->getStyle("D{$row}:E{$row}")->getNumberFormat()->setFormatCode('#,##0');
                $row++;

                // GRAND TOTAL EKUITAS
                $row = $this->renderGrandTotal($sheet, $row, 'JUMLAH EKUITAS', $totalEkuitas);
                $row += 2;

                // ============================================================
                // JUMLAH KEWAJIBAN + EKUITAS (Harus Balance dengan Total Aset)
                // ============================================================
                $isBalance = abs($totalAset - $totalKewajibanEkuitas) < 1; // toleransi 1 rupiah pembulatan
                $balanceLabel = 'JUMLAH KEWAJIBAN + EKUITAS' . ($isBalance ? ' ✓ BALANCE' : ' ✗ TIDAK BALANCE');
                $balanceColor = $isBalance ? '1E8449' : 'C0392B';

                $sheet->mergeCells("A{$row}:C{$row}");
                $sheet->setCellValue("A{$row}", $balanceLabel);
                $sheet->setCellValue("D{$row}", $totalKewajibanEkuitas);
                $sheet->getStyle("A{$row}:E{$row}")->applyFromArray([
                    'font' => ['bold' => true, 'size' => 12, 'color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $balanceColor]],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_MEDIUM]],
                ]);
                $sheet->getStyle("D{$row}")->getNumberFormat()->setFormatCode('#,##0');
                $sheet->getStyle("D{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
                $row++;

                // --- KOLOM LEBAR ---
                $sheet->getColumnDimension('A')->setWidth(8);
                $sheet->getColumnDimension('B')->setWidth(42);
                $sheet->getColumnDimension('C')->setWidth(16);
                $sheet->getColumnDimension('D')->setWidth(22);
                $sheet->getColumnDimension('E')->setWidth(22);

                // Header kolom debit/kredit
                $headerRow = 4;
                $sheet->setCellValue("D4", 'DEBIT (Rp)');
                $sheet->setCellValue("E4", 'KREDIT (Rp)');
                $sheet->getStyle("D4:E4")->getFont()->setBold(true);
                $sheet->getStyle("D4:E4")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            },
        ];
    }

    // ============================================================
    // HELPERS: RENDER ROWS
    // ============================================================

    private function renderSectionHeader($sheet, int $row, string $label): int
    {
        $sheet->mergeCells("A{$row}:E{$row}");
        $sheet->setCellValue("A{$row}", $label);
        $sheet->getStyle("A{$row}:E{$row}")->applyFromArray([
            'font' => ['bold' => true, 'size' => 11, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1A5276']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        return $row + 1;
    }

    private function renderSubHeader($sheet, int $row, string $label): int
    {
        $sheet->mergeCells("A{$row}:E{$row}");
        $sheet->setCellValue("A{$row}", $label);
        $sheet->getStyle("A{$row}:E{$row}")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '2E86C1']],
        ]);
        return $row + 1;
    }

    private function renderSubSubHeader($sheet, int $row, string $label): int
    {
        $sheet->mergeCells("B{$row}:E{$row}");
        $sheet->setCellValue("B{$row}", $label);
        $sheet->getStyle("B{$row}:E{$row}")->applyFromArray([
            'font' => ['bold' => true, 'italic' => true],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'EBF5FB']],
        ]);
        return $row + 1;
    }

    private function renderRows($sheet, int $row, array $items): int
    {
        foreach ($items as $item) {
            $sheet->setCellValue("A{$row}", $item['kode']);
            $sheet->setCellValue("B{$row}", '   ' . $item['nama']);
            if ($item['saldo'] >= 0) {
                $sheet->setCellValue("D{$row}", $item['saldo']);
                $sheet->setCellValue("E{$row}", '');
            } else {
                $sheet->setCellValue("D{$row}", '');
                $sheet->setCellValue("E{$row}", abs($item['saldo']));
            }
            $sheet->getStyle("D{$row}:E{$row}")->getNumberFormat()->setFormatCode('#,##0');
            $sheet->getStyle("A{$row}:E{$row}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_HAIR);
            $row++;
        }
        return $row;
    }

    private function renderSubTotal($sheet, int $row, string $label, float $nilai): int
    {
        $sheet->mergeCells("A{$row}:C{$row}");
        $sheet->setCellValue("A{$row}", $label);
        $sheet->setCellValue("D{$row}", $nilai >= 0 ? $nilai : 0);
        $sheet->setCellValue("E{$row}", $nilai < 0 ? abs($nilai) : 0);
        $sheet->getStyle("A{$row}:E{$row}")->applyFromArray([
            'font' => ['bold' => true],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F2F3F4']],
            'borders' => ['top' => ['borderStyle' => Border::BORDER_THIN]],
        ]);
        $sheet->getStyle("D{$row}:E{$row}")->getNumberFormat()->setFormatCode('#,##0');
        return $row + 1;
    }

    private function renderTotal($sheet, int $row, string $label, float $nilai, string $color): int
    {
        $sheet->mergeCells("A{$row}:C{$row}");
        $sheet->setCellValue("A{$row}", $label);
        $sheet->setCellValue("D{$row}", $nilai >= 0 ? $nilai : 0);
        $sheet->setCellValue("E{$row}", $nilai < 0 ? abs($nilai) : 0);
        $sheet->getStyle("A{$row}:E{$row}")->applyFromArray([
            'font' => ['bold' => true],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $color]],
            'borders' => [
                'top'    => ['borderStyle' => Border::BORDER_THIN],
                'bottom' => ['borderStyle' => Border::BORDER_DOUBLE],
            ],
        ]);
        $sheet->getStyle("D{$row}:E{$row}")->getNumberFormat()->setFormatCode('#,##0');
        return $row + 1;
    }

    private function renderGrandTotal($sheet, int $row, string $label, float $nilai): int
    {
        $sheet->mergeCells("A{$row}:C{$row}");
        $sheet->setCellValue("A{$row}", $label);
        $sheet->setCellValue("D{$row}", $nilai >= 0 ? $nilai : 0);
        $sheet->setCellValue("E{$row}", $nilai < 0 ? abs($nilai) : 0);
        $sheet->getStyle("A{$row}:E{$row}")->applyFromArray([
            'font' => ['bold' => true, 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'AED6F1']],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_MEDIUM]],
        ]);
        $sheet->getStyle("D{$row}:E{$row}")->getNumberFormat()->setFormatCode('#,##0');
        return $row + 1;
    }

    // ============================================================
    // CORE: HITUNG SALDO SEMUA COA DARI SEMUA TABEL TRANSAKSI
    // ============================================================

    private function hitungSaldoSemuaCoa($allCoas): array
    {
        // Saldo awal dari master_coas (nominal_default / saldo_debit)
        $saldos = [];
        foreach ($allCoas as $coa) {
            $saldos[$coa->id] = (float)$coa->saldo_debit - (float)$coa->saldo_kredit;
        }

        // 1. Trans Kas
        $transKas = DB::table('trans_kas')
            ->whereDate('tanggal_transaksi', '<=', $this->tanggal)
            ->get();

        foreach ($transKas as $t) {
            if ($t->transaksi == 1) {
                // Kas Masuk: Debit id_account_kas, Kredit id_account_kas_lain
                if ($t->id_account_kas)      $saldos[$t->id_account_kas]      = ($saldos[$t->id_account_kas] ?? 0) + $t->nominal;
                if ($t->id_account_kas_lain) $saldos[$t->id_account_kas_lain] = ($saldos[$t->id_account_kas_lain] ?? 0) - $t->nominal;
            } else {
                // Kas Keluar: Kredit id_account_kas, Debit id_account_kas_lain
                if ($t->id_account_kas)      $saldos[$t->id_account_kas]      = ($saldos[$t->id_account_kas] ?? 0) - $t->nominal;
                if ($t->id_account_kas_lain) $saldos[$t->id_account_kas_lain] = ($saldos[$t->id_account_kas_lain] ?? 0) + $t->nominal;
            }
        }

        // 2. Trans Kas Bank
        $transKasBank = DB::table('trans_kas_banks')
            ->whereDate('tanggal_transaksi', '<=', $this->tanggal)
            ->get();

        foreach ($transKasBank as $t) {
            if ($t->transaksi == 21) {
                // Bank Masuk: Debit id_account_bank, Kredit id_account_bank_lain
                if ($t->id_account_bank)      $saldos[$t->id_account_bank]      = ($saldos[$t->id_account_bank] ?? 0) + $t->nominal;
                if ($t->id_account_bank_lain) $saldos[$t->id_account_bank_lain] = ($saldos[$t->id_account_bank_lain] ?? 0) - $t->nominal;
            } else {
                // Bank Keluar: Kredit id_account_bank, Debit id_account_bank_lain
                if ($t->id_account_bank)      $saldos[$t->id_account_bank]      = ($saldos[$t->id_account_bank] ?? 0) - $t->nominal;
                if ($t->id_account_bank_lain) $saldos[$t->id_account_bank_lain] = ($saldos[$t->id_account_bank_lain] ?? 0) + $t->nominal;
            }
        }

        // 3. Operasional Pay (Kas Keluar: Kredit Kas, Debit Beban)
        $ops = DB::table('operasional_pays')
            ->whereDate('tanggal_transaksi', '<=', $this->tanggal)
            ->get();

        foreach ($ops as $t) {
            if ($t->id_account_kas)   $saldos[$t->id_account_kas]   = ($saldos[$t->id_account_kas] ?? 0) - $t->nominal;
            if ($t->id_account_beban) $saldos[$t->id_account_beban] = ($saldos[$t->id_account_beban] ?? 0) + $t->nominal;
        }

        // 4. Bon Pay (Invoice Payment: Debit Kas (id_account), Kredit Piutang)
        $bonPays = DB::table('bon_pays')
            ->whereDate('tanggal_pembayaran', '<=', $this->tanggal)
            ->get();

        // Piutang usaha IDR = COA 101.201 (id = 10 dari data kamu)
        $piutangCoaId = $allCoas->where('kode_akuntansi', '101.201')->first()?->id ?? 10;
        foreach ($bonPays as $t) {
            if ($t->id_account) $saldos[$t->id_account] = ($saldos[$t->id_account] ?? 0) + $t->nominal_pembayaran;
            $saldos[$piutangCoaId] = ($saldos[$piutangCoaId] ?? 0) - $t->nominal_pembayaran;
        }

        // 5. Invoice (Debit Piutang, Kredit Pendapatan)
        // Piutang bertambah sebesar nilai invoice yang belum lunas
        $invoices = DB::table('invoices')
            ->whereDate('tgl_invoice', '<=', $this->tanggal)
            ->get();

        foreach ($invoices as $inv) {
            $grandTotal = (float)($inv->total ?? 0);
            // Tambah ke piutang
            $saldos[$piutangCoaId] = ($saldos[$piutangCoaId] ?? 0) + $grandTotal;
        }

        // 6. Trans Payment Details (Hutang Bayar: Debit Hutang, Kredit Kas/Bank)
        $paymentDetails = DB::table('trans_payment_details')
            ->whereDate('tanggal_pembayaran', '<=', $this->tanggal)
            ->get();

        foreach ($paymentDetails as $t) {
            // Debit akun debit (hutang berkurang)
            if ($t->id_account_debit)  $saldos[$t->id_account_debit]  = ($saldos[$t->id_account_debit] ?? 0) + $t->nominal;
            // Kredit akun kredit (kas/bank berkurang)
            if ($t->id_account_kredit) $saldos[$t->id_account_kredit] = ($saldos[$t->id_account_kredit] ?? 0) - $t->nominal;
        }

        // 7. PO Billing (Hutang Bertambah: Debit Persediaan/Aset, Kredit Hutang)
        $poBillings = DB::table('po_billings')
            ->whereDate('tanggal_transaksi', '<=', $this->tanggal)
            ->get();

        // Hutang usaha IDR = COA 201.101
        $hutangCoaId = $allCoas->where('kode_akuntansi', '201.101')->first()?->id ?? 45;
        // Persediaan bahan baku = COA 101.301
        $persediaanCoaId = $allCoas->where('kode_akuntansi', '101.301')->first()?->id ?? 13;

        foreach ($poBillings as $po) {
            $saldos[$persediaanCoaId] = ($saldos[$persediaanCoaId] ?? 0) + (float)$po->total_nilai_barang;
            $saldos[$hutangCoaId]     = ($saldos[$hutangCoaId] ?? 0)     + (float)$po->total_akhir;
        }

        return $saldos;
    }

    // ============================================================
    // HITUNG LABA BERJALAN (Pendapatan - Beban)
    // ============================================================

    private function hitungLabaBerjalan($allCoas): float
    {
        // Total Pendapatan dari Invoices
        $totalPendapatan = DB::table('invoices')
            ->whereDate('tgl_invoice', '<=', $this->tanggal)
            ->sum('total');

        // Total Beban dari Operasional Pay
        $totalBeban = DB::table('operasional_pays')
            ->whereDate('tanggal_transaksi', '<=', $this->tanggal)
            ->sum('nominal');

        return (float)$totalPendapatan - (float)$totalBeban;
    }

    // ============================================================
    // FILTER COA BY RANGE KODE AKUNTANSI
    // ============================================================

    private function filterByRange(array $saldos, $allCoas, string $from, string $to): array
    {
        $result = [];
        foreach ($allCoas as $coa) {
            if ($coa->kode_akuntansi >= $from && $coa->kode_akuntansi <= $to) {
                $result[] = [
                    'kode'  => $coa->kode_akuntansi,
                    'nama'  => $coa->nama_akun,
                    'saldo' => $saldos[$coa->id] ?? 0,
                ];
            }
        }
        return $result;
    }
}
