<?php

namespace App\Exports;

use App\Models\KartuInstruksiKerja;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class ReportSpkExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $start_date;
    protected $end_date;

    public function __construct($start_date, $end_date)
    {
        $this->start_date = $start_date;
        $this->end_date = $end_date;
    }

    public function query()
    {
        return KartuInstruksiKerja::with([
            'salesOrder.finishGoodItem',
            'salesOrder.masterItem',
            'salesOrder.customerAddress',
            'kartuInstruksiKerjaBoms',
            'printings',
            'dieMakings',
            'finishings',
            'packagings',
            'suratJalans'
        ])
            ->whereHas('salesOrder', function ($q) {
        $q->whereBetween('eta_marketing', [
            $this->start_date,
            $this->end_date
        ]);
    });
    }

    public function headings(): array
    {
        return [
            // Row 1: Header Grup (Manual via Styles nanti, di sini kita define label kolom saja)
            'NO',
            'TGL_SO',
            'NO_SO',
            'NO PO',
            'TGL_SPK',
            'ETA_SPK',
            'NO_SPK',
            'KODE_PRODUK',
            'NAMA_PRODUK',
            'KODECUSTOMER',
            'CUSTOMER',
            'JUMLAH_ORDER',
            'SHETCETAK',
            'TOTSHETCETAK',
            'JUMLAHPRODUKSI',
            'UKPOTONG',
            'UKCETAK',
            'UP1',
            'UP2',
            'UP3',
            'WASTE (KERTAS)',
            'JUMLAH_TRANSFER_BRG_JADI',
            'JUMLAHKIRIM',
            'OUTSTANDING_SPK',
            'JUMLAH POTONG',
            'JUMLAH POTONG RUSAK',
            'JUMLAH CETAK1',
            'JUMLAH CETAK1 RUSAK',
            'JUMLAH CETAK2',
            'JUMLAH CETAK2 RUSAK',
            'JUMLAH CUTTING',
            'JUMLAH CUTTING RUSAK',
            'JUMLAH_UV_HOLO',
            'JUMLAH_UV_HOLO_RUSAK',
            'JUMLAH HOTPRINT',
            'JUMLAH HOTPRINT RUSAK',
            'JUMLAH_UV_SPOT',
            'JUMLAH_UV_SPOT_RUSAK',
            'JUMLAH VARNISH',
            'JUMLAH VARNISH RUSAK',
            'JUMLAH EMBOSS',
            'JUMLAH EMBOSS RUSAK',
            'JUMLAH PROTOL',
            'JUMLAH PROTOL RUSAK',
            'JUMLAH LEM',
            'JUMLAH LEM RUSAK',
            'JUMLAH SORTEER',
            'JUMLAH SORTEER RUSAK',
            'OUTSTANDING ORDER',
            'TGLKIRIM',
            'STATUSFINISH'
        ];
    }

    public function map($kik): array
    {
        $so = $kik->salesOrder;
        $bom = $kik->kartuInstruksiKerjaBoms->first();
        $fg = $so->finishGoodItem;

        // 1. Kalkulasi Packaging (Barang Jadi)
        $totalTransferJADI = $kik->packagings->reduce(function ($total, $p) {
            return $total + ($p->jumlah_satuan_penuh * $p->qty_persatuan_penuh) + ($p->jumlah_satuan_sisa * $p->qty_persatuan_sisa);
        }, 0);

        // 2. Kalkulasi Surat Jalan (Kirim)
        $totalKirim = $kik->suratJalans->sum('qty_pengiriman');
        $tglKirim = $kik->suratJalans->sortByDesc('tgl_surat_jalan')->first()?->tgl_surat_jalan;

        // 3. Logic Mapping Departemen Printing
        $jmlPotong = $kik->printings->where('proses_printing', 'Potong')->sum('hasil_baik_printing');
        $jmlPotongRsk = $kik->printings->where('proses_printing', 'Potong')->sum('hasil_rusak_printing');
        $jmlCetak1 = $kik->printings->where('tahap_printing', 'Proses Cetak')->sum('hasil_baik_printing');
        $jmlCetak1Rsk = $kik->printings->where('tahap_printing', 'Proses Cetak')->sum('hasil_rusak_printing');
        $jmlCetak2 = $kik->printings->where('tahap_printing', 'Proses Cetak 2')->sum('hasil_baik_printing');
        $jmlCetak2Rsk = $kik->printings->where('tahap_printing', 'Proses Cetak 2')->sum('hasil_rusak_printing');

        // 4. Logic Mapping Departemen DieMaking
        $cutting = $kik->dieMakings->where('proses_diemaking', 'Cutting')->sum('hasil_baik_diemaking');
        $cuttingRsk = $kik->dieMakings->where('proses_diemaking', 'Cutting')->sum('hasil_rusak_diemaking');
        $uvHolo = $kik->dieMakings->where('proses_diemaking', 'Uv Holo')->sum('hasil_baik_diemaking');
        $uvHoloRsk = $kik->dieMakings->where('proses_diemaking', 'Uv Holo')->sum('hasil_rusak_diemaking');
        $hotprint = $kik->dieMakings->where('proses_diemaking', 'Hot Print')->sum('hasil_baik_diemaking');
        $hotprintRsk = $kik->dieMakings->where('proses_diemaking', 'Hot Print')->sum('hasil_rusak_diemaking');
        $uvSpot = $kik->dieMakings->where('proses_diemaking', 'Uv Spot')->sum('hasil_baik_diemaking');
        $uvSpotRsk = $kik->dieMakings->where('proses_diemaking', 'Uv Spot')->sum('hasil_rusak_diemaking');
        $varnish = $kik->dieMakings->where('proses_diemaking', 'Uv Varnish')->sum('hasil_baik_diemaking');
        $varnishRsk = $kik->dieMakings->where('proses_diemaking', 'Uv Varnish')->sum('hasil_rusak_diemaking');
        $emboss = $kik->dieMakings->where('proses_diemaking', 'Embos')->sum('hasil_baik_diemaking');
        $embossRsk = $kik->dieMakings->where('proses_diemaking', 'Embos')->sum('hasil_rusak_diemaking');

        // 5. Logic Mapping Departemen Finishing
        $protol = $kik->finishings->where('proses_finishing', 'Protol')->sum('hasil_baik_finishing');
        $protolRsk = $kik->finishings->where('proses_finishing', 'Protol')->sum('hasil_rusak_finishing');
        $lem = $kik->finishings->where('proses_finishing', 'Lem')->sum('hasil_baik_finishing');
        $lemRsk = $kik->finishings->where('proses_finishing', 'Lem')->sum('hasil_rusak_finishing');
        $sorteer = $kik->finishings->where('proses_finishing', 'Sorter')->sum('hasil_baik_finishing');
        $sorteerRsk = $kik->finishings->where('proses_finishing', 'Sorter')->sum('hasil_rusak_finishing');

        static $no = 1;

        return [
            $no++,
            $so->eta_marketing
                ? Carbon::parse($so->eta_marketing)->format('d-m-Y')
                : '',
            $so->no_bon_pesanan,
            $so->no_po_customer,
            $so->eta_marketing
                ? Carbon::parse($so->eta_marketing)->format('d-m-Y')
                : '',
            $kik->tgl_estimasi_selesai ? $kik->tgl_estimasi_selesai->format('d-m-Y') : '',
            $kik->no_kartu_instruksi_kerja,
            $fg?->kode_material_produk ?? $so->masterItem?->kode_master_item,
            $fg?->nama_barang ?? $so->masterItem?->nama_master_item,
            $so->customerAddress?->kode_customer,
            $so->customerAddress?->nama_customer,
            $so->jumlah_pesanan,
            $bom?->jumlah_sheet_cetak,
            $bom?->jumlah_total_sheet_cetak,
            $bom?->jumlah_produksi,
            $fg?->ukuran_potong,
            $fg?->ukuran_cetak,
            $fg?->up_satu,
            $fg?->up_dua,
            $fg?->up_tiga,
            $bom?->waste,
            $totalTransferJADI,
            $totalKirim,
            $totalTransferJADI - ($bom?->jumlah_produksi ?? 0), // Outstanding SPK
            $jmlPotong,
            $jmlPotongRsk,
            $jmlCetak1,
            $jmlCetak1Rsk,
            $jmlCetak2,
            $jmlCetak2Rsk,
            $cutting,
            $cuttingRsk,
            $uvHolo,
            $uvHoloRsk,
            $hotprint,
            $hotprintRsk,
            $uvSpot,
            $uvSpotRsk,
            $varnish,
            $varnishRsk,
            $emboss,
            $embossRsk,
            $protol,
            $protolRsk,
            $lem,
            $lemRsk,
            $sorteer,
            $sorteerRsk,
            $totalKirim - $so->jumlah_pesanan, 
            $tglKirim,
            $kik->status_finish
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]], // Header Bold
        ];
    }
}
