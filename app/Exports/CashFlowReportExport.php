<?php

namespace App\Exports;

use App\Models\BonPay;
use App\Models\TransKasBank;
use App\Models\TransPaymentDetail;
use App\Models\MasterCoa;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class CashFlowReportExport implements FromArray, WithStyles, ShouldAutoSize, WithColumnFormatting
{
    protected $year;

    public function __construct($year)
    {
        $this->year = $year;
    }

    public function array(): array
    {
        $year = $this->year;

        // Inisialisasi struktur data untuk 4 Triwulan (Q1, Q2, Q3, Q4)
        $d = [
            'pelanggan' => [0,0,0,0], 'lainnya_in' => [0,0,0,0],
            'pemasok'   => [0,0,0,0], 'gaji'       => [0,0,0,0], 'ops' => [0,0,0,0], 'pajak' => [0,0,0,0],
            'mesin'     => [0,0,0,0], 'jual_aset'  => [0,0,0,0], 'inv_long' => [0,0,0,0],
            'pinjam'    => [0,0,0,0], 'cicilan'    => [0,0,0,0], 'bunga' => [0,0,0,0], 'dividen' => [0,0,0,0]
        ];

        // 1. Ambil data dari BonPay (Biasanya untuk pengeluaran/pembayaran)
        $bonPays = BonPay::with('account')
            ->whereYear('tanggal_pembayaran', $year)
            ->get();

        foreach ($bonPays as $bp) {
            $q = ceil(Carbon::parse($bp->tanggal_pembayaran)->month / 3) - 1;
            $this->categorizeFlow($d, $bp->account->kode_akuntansi ?? '', $bp->nominal_pembayaran, $q, 'out');
        }

        // 2. Ambil data dari TransKasBank (Hanya transaksi keluar/id 22)
        $kasBanks = TransKasBank::with('accountBankLain')
            ->whereYear('tanggal_transaksi', $year)
            ->where('transaksi', 22)
            ->get();

        foreach ($kasBanks as $kb) {
            $q = ceil(Carbon::parse($kb->tanggal_transaksi)->month / 3) - 1;
            $this->categorizeFlow($d, $kb->accountBankLain->kode_akuntansi ?? '', $kb->nominal, $q, 'out');
        }

        // 3. Ambil data dari TransPayment (Melalui TransPaymentDetail)
        // Fokus pada id_account_kredit sebagai sumber kas/bank yang berkurang
        $payDetails = TransPaymentDetail::with(['transPayment', 'accountKredit'])
            ->whereHas('transPayment', function($query) use ($year) {
                $query->whereYear('tanggal_header', $year);
            })->get();

        foreach ($payDetails as $pd) {
            $q = ceil(Carbon::parse($pd->transPayment->tanggal_header)->month / 3) - 1;
            // Untuk TransPayment, jika akun kredit adalah akun pendapatan, bisa dianggap sebagai 'in'
            // Namun secara default di breakdown Anda banyak masuk ke Pembayaran Pemasok
            $this->categorizeFlow($d, $pd->accountKredit->kode_akuntansi ?? '', $pd->nominal, $q, 'in');
        }

        // Saldo Awal (Sesuaikan logic ini jika ada tabel khusus saldo awal per periode)
        $saldoAwalTahun = MasterCoa::where('kode_akuntansi', 'like', '101%')->sum('nominal_default');

        return $this->buildExcelRows($d, $saldoAwalTahun, $year);
    }

    /**
     * Logika Pemetaan Kode COA ke Kategori Cashflow sesuai Breakdown
     */
    private function categorizeFlow(&$d, $coaCode, $amount, $q, $direction)
    {
        $code = str_replace([',', '.'], '', $coaCode);
        if (empty($code)) return;

        // OPERASI - MASUK
        if (str_starts_with($code, '101') && !in_array($code, ['101001'])) { // Rekening-rekening BCA/BRI/E-Wallet
            $d['pelanggan'][$q] += $amount;
        }
        elseif (str_starts_with($code, '401') || $code == '101201' || $code == '101202') {
            $d['pelanggan'][$q] += $amount;
        }
        elseif (str_starts_with($code, '402') || str_starts_with($code, '403') || str_starts_with($code, '101')) {
            $d['lainnya_in'][$q] += $amount;
        }

        // OPERASI - KELUAR
        elseif (str_starts_with($code, '5') || in_array($code, ['201101', '201102', '201103', '201104'])) {
            $d['pemasok'][$q] += $amount;
        }
        elseif (in_array($code, ['602001', '602002', '602003'])) {
            $d['gaji'][$q] += $amount;
        }
        elseif (str_starts_with($code, '605') || str_starts_with($code, '2013')) {
            $d['pajak'][$q] += $amount;
        }

        // INVESTASI
        elseif (str_starts_with($code, '102') || str_starts_with($code, '103')) {
            $d['mesin'][$q] += $amount;
        }

        // PENDANAAN
        elseif ($code == '201001') {
            $d['pinjam'][$q] += $amount;
        }
        elseif ($code == '201002' || str_starts_with($code, '202')) {
            $d['cicilan'][$q] += $amount;
        }
        elseif ($code == '603102') {
            $d['bunga'][$q] += $amount;
        }
        elseif (str_starts_with($code, '604') || str_starts_with($code, '3')) {
            $d['dividen'][$q] += $amount;
        }

        // DEFAULT KE OPERASIONAL (Jika tidak masuk kategori di atas)
        elseif (str_starts_with($code, '6')) {
            $d['ops'][$q] += $amount;
        }
    }

    private function buildExcelRows($d, $saldoAwalTahun, $year)
    {
        $rows = [
            ['LAPORAN ARUS KAS'], ["Untuk Tahun Berakhir 31 Desember {$year}"], ['(Dalam Rupiah)'], [''],
            ['Keterangan', 'Triwulan I', 'Triwulan II', 'Triwulan III', 'Triwulan IV'],
            ['ARUS KAS DARI AKTIVITAS OPERASI'],
            ['Penerimaan Kas dari Pelanggan', $d['pelanggan'][0], $d['pelanggan'][1], $d['pelanggan'][2], $d['pelanggan'][3]],
            ['Penerimaan Lainnya', $d['lainnya_in'][0], $d['lainnya_in'][1], $d['lainnya_in'][2], $d['lainnya_in'][3]],
        ];

        // Total Penerimaan
        $totalIn = []; for($i=0;$i<4;$i++) $totalIn[$i] = $d['pelanggan'][$i] + $d['lainnya_in'][$i];
        $rows[] = array_merge(['Total Penerimaan Kas'], $totalIn);

        $rows[] = ['Pembayaran kepada Pemasok', -$d['pemasok'][0], -$d['pemasok'][1], -$d['pemasok'][2], -$d['pemasok'][3]];
        $rows[] = ['Pembayaran Gaji dan Upah', -$d['gaji'][0], -$d['gaji'][1], -$d['gaji'][2], -$d['gaji'][3]];
        $rows[] = ['Pembayaran Biaya Operasional', -$d['ops'][0], -$d['ops'][1], -$d['ops'][2], -$d['ops'][3]];
        $rows[] = ['Pembayaran Pajak', -$d['pajak'][0], -$d['pajak'][1], -$d['pajak'][2], -$d['pajak'][3]];

        // Total Pengeluaran & Net Operasi
        $totalOut = []; $netOps = [];
        for($i=0;$i<4;$i++){
            $totalOut[$i] = -($d['pemasok'][$i] + $d['gaji'][$i] + $d['ops'][$i] + $d['pajak'][$i]);
            $netOps[$i] = $totalIn[$i] + $totalOut[$i];
        }
        $rows[] = array_merge(['Total Pengeluaran Kas'], $totalOut);
        $rows[] = array_merge(['Kas Bersih dari Aktivitas Operasi'], $netOps);

        // INVESTASI
        $rows[] = [''];
        $rows[] = ['ARUS KAS DARI AKTIVITAS INVESTASI'];
        $rows[] = ['Pembelian Mesin dan peralatan', -$d['mesin'][0], -$d['mesin'][1], -$d['mesin'][2], -$d['mesin'][3]];
        $rows[] = ['Penjualan aset tetap', $d['jual_aset'][0], $d['jual_aset'][1], $d['jual_aset'][2], $d['jual_aset'][3]];
        $rows[] = ['Investasi Jangka Panjang', -$d['inv_long'][0], -$d['inv_long'][1], -$d['inv_long'][2], -$d['inv_long'][3]];
        $netInv = [];
        for($i=0;$i<4;$i++) $netInv[$i] = (-$d['mesin'][$i]) + $d['jual_aset'][$i] + (-$d['inv_long'][$i]);
        $rows[] = array_merge(['Kas Bersih dari Aktivitas Investasi'], $netInv);

        // PENDANAAN
        $rows[] = [''];
        $rows[] = ['ARUS KAS DARI AKTIVITAS PENDANAAN'];
        $rows[] = ['Penerimaan Pinjaman Bank', $d['pinjam'][0], $d['pinjam'][1], $d['pinjam'][2], $d['pinjam'][3]];
        $rows[] = ['Pembayaran Cicilan Pinjaman', -$d['cicilan'][0], -$d['cicilan'][1], -$d['cicilan'][2], -$d['cicilan'][3]];
        $rows[] = ['Pembayaran Bunga Pinjaman', -$d['bunga'][0], -$d['bunga'][1], -$d['bunga'][2], -$d['bunga'][3]];
        $rows[] = ['Pembayaran Dividen/Lainnya', -$d['dividen'][0], -$d['dividen'][1], -$d['dividen'][2], -$d['dividen'][3]];
        $netPend = [];
        for($i=0;$i<4;$i++) $netPend[$i] = $d['pinjam'][$i] - $d['cicilan'][$i] - $d['bunga'][$i] - $d['dividen'][$i];
        $rows[] = array_merge(['Kas Bersih dari Aktivitas Pendanaan'], $netPend);

        // RINGKASAN
        $rows[] = [''];
        $rows[] = ['RINGKASAN ARUS KAS'];
        $netIncr = []; for($i=0;$i<4;$i++) $netIncr[$i] = $netOps[$i] + $netInv[$i] + $netPend[$i];
        $rows[] = array_merge(['Kenaikan (Penurunan) Kas Bersih'], $netIncr);

        // Flowing Balance
        $awal = [$saldoAwalTahun]; $akhir = [];
        for($i=0;$i<4;$i++) {
            $akhir[$i] = $awal[$i] + $netIncr[$i];
            if($i < 3) $awal[$i+1] = $akhir[$i];
        }
        $rows[] = array_merge(['Kas Awal Periode'], $awal);
        $rows[] = array_merge(['Kas Akhir Periode'], $akhir);

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $boldRows = [6, 9, 14, 15, 17, 21, 23, 28, 30, 31, 32, 33];
        foreach($boldRows as $r) {
            $sheet->getStyle("A{$r}:E{$r}")->getFont()->setBold(true);
        }
        return [];
    }

    public function columnFormats(): array
    {
        return [
            'B' => '#,##0;(#,##0)',
            'C' => '#,##0;(#,##0)',
            'D' => '#,##0;(#,##0)',
            'E' => '#,##0;(#,##0)'
        ];
    }
}
