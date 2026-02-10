<?php

namespace App\Exports;

use App\Models\TransPaymentDetail;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PaymentReportExport implements FromQuery, WithMapping, WithHeadings, ShouldAutoSize
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
        return TransPaymentDetail::query()
            ->with([
                'transPayment.poBilling.purchaseOrder.supplier',
                'transPayment.poBilling.penerimaanBarang.purchaseOrder.supplier',
                'transPayment.poBilling.details',
                'metodeBayar',
                'accountDebit',
                'accountKredit'
            ])
            ->whereBetween('tanggal_pembayaran', [$this->startDate, $this->endDate]);
    }

    public function headings(): array
    {
        return [
            'No Bukti',
            'Bukti PO',
            'Supplier',
            'Item',
            'No Invoice',
            'Tgl Invoice',
            'Tgl Jatuh Tempo',
            'Qty',
            'Harga Satuan',
            'PPN',
            'Total Bill',
            'Total Payment',
            'Keterangan',
            'Method',
            'Curs',
            'Bank',
            'Bank AN',
            'Bank Rekening',
            'Akun Debet',
            'Akun Kredit'
        ];
    }

    public function map($paymentDetail): array
    {
        $bill = $paymentDetail->transPayment->poBilling;


        if ($bill->penerimaanBarang && $bill->penerimaanBarang->purchaseOrder) {
            $buktiPo = $bill->penerimaanBarang->purchaseOrder->no_po;
            $namaSupplier = $bill->penerimaanBarang->purchaseOrder->supplier->nama_suplier ?? '-';
        }

        elseif ($bill->purchaseOrder) {
            $buktiPo = $bill->purchaseOrder->no_po;
            $namaSupplier = $bill->purchaseOrder->supplier->nama_suplier ?? '-';
        }

        else {
            $buktiPo = $bill->no_po_asal;
            $namaSupplier = '-';
        }

        // --- DATA LAINNYA ---
        $namaMetode = $paymentDetail->metodeBayar->metode_bayar ?? '-';
        $namaDebit  = $paymentDetail->accountDebit->nama_akun ?? '-';
        $namaKredit = $paymentDetail->accountKredit->nama_akun ?? '-';

        $itemNames = $bill->details->pluck('master_item')->implode(', ');
        $totalQty = $bill->details->sum('qty');
        $avgPrice = $bill->details->avg('harga_per_qty');

        return [
            $paymentDetail->transPayment->no_pembayaran,
            $buktiPo,
            $namaSupplier,
            $itemNames,
            $bill->invoice_vendor,
            $bill->tanggal_transaksi,
            $bill->jatuh_tempo,
            $totalQty,
            $avgPrice,
            $bill->ppn,
            $bill->total_akhir,
            $paymentDetail->nominal,
            $paymentDetail->keterangan,
            $namaMetode,
            $paymentDetail->curs,
            $paymentDetail->bank,
            $paymentDetail->an_rekening,
            $paymentDetail->no_rekening,
            $namaDebit,
            $namaKredit,
        ];
    }
}
