/* eslint-disable @typescript-eslint/no-explicit-any */

import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Karyawan } from '@/types/karyawan';
import { PenerimaanBarang } from '@/types/penerimaanBarang';
import { PoBillingDetail } from '@/types/poBilling';
import { Head, useForm } from '@inertiajs/react';


interface CreateProps {
    karyawans: Karyawan[];
    lpbList: PenerimaanBarang[];
}
interface PoBillingForm extends Record<string, any> {
    no_bukti_tagihan: string;
    id_karyawan: string | '';
    id_purchase_order: string | '';
    id_penerimaan_barang: string | '';
    gudang: string;
    periode: number;
    tanggal_transaksi: string;
    jatuh_tempo: string;
    ongkir: number;
    total_nilai_barang: number;
    ppn: number;
    dp: number;
    total_akhir: number;
    invoice_vendor: string;
    keterangan: string;
    items: PoBillingDetail[];
}

export default function Create({ karyawans, lpbList }: CreateProps) {
    const { data, setData, post, processing, errors, transform } = useForm<PoBillingForm>({
        no_bukti_tagihan: '',
        id_karyawan: '',
        id_purchase_order: '',
        id_penerimaan_barang: '',
        gudang: '',
        periode: new Date().getFullYear(),
        tanggal_transaksi: '',
        jatuh_tempo: '',
        ongkir: 0,
        total_nilai_barang: 0,
        ppn: 0,
        dp: 0,
        total_akhir: 0,
        invoice_vendor: '',
        keterangan: '',
        items: [],
    });

    const handleLpbChange = (lpbId: string) => {
        const selectedLpb = lpbList.find((lpb) => lpb.id === lpbId);
        if (!selectedLpb || !selectedLpb.items) return;

        const po = selectedLpb.purchase_order;
        const mappedItems = selectedLpb.items.map((item) => {
            const qty = item.qty_penerimaan ?? 0;
            const harga = item.purchase_order_item?.harga_satuan ?? 0;
            const diskon = item.purchase_order_item?.diskon_satuan ?? 0;

            const subtotal = qty * harga;
            const nilaiDiskon = subtotal * (diskon / 100);

            return {
                id_penerimaan_barang_item: Number(item.id),
                master_item: item.purchase_order_item?.master_item?.nama_master_item ?? 'Item',
                qty,
                harga_per_qty: harga,
                discount: diskon,
                unit: item.purchase_order_item?.master_item?.unit?.nama_satuan ?? null,
                total: subtotal - nilaiDiskon,
            };
        });


        const totalNilaiBarang = mappedItems.reduce((sum, item) => sum + item.total, 0);


        const ppnPersen = po?.ppn ?? 0;
        const ppnNominal = totalNilaiBarang * (ppnPersen / 100);

        setData((prev) => ({
            ...prev,
            id_penerimaan_barang: selectedLpb.id,
            id_purchase_order: selectedLpb.id_purchase_order,
            ongkir: po?.ongkir ?? 0,
            dp: po?.dp ?? 0,
            ppn: Math.round(ppnNominal),
            items: mappedItems,
        }));
    };


   const totalNilaiBarang = data.items.reduce((sum, item) => {
       const subtotal = item.qty * item.harga_per_qty;
       const nilaiDiskon = subtotal * (item.discount / 100);
       return sum + (subtotal - nilaiDiskon);
   }, 0);

   // ppn di data = NOMINAL (bukan persen)
   const totalAkhir = totalNilaiBarang + (Number(data.ppn) || 0) + (Number(data.ongkir) || 0) - (Number(data.dp) || 0);

    const rupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const handleSubmit = () => {
        transform((formData) => ({
            ...formData,
            total_nilai_barang: totalNilaiBarang,
            total_akhir: totalAkhir,
        }));

        post(route('poBillings.store'));
    };


    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Billing', href: route('poBillings.index') },
                { title: 'Create', href: '#' },
            ]}
        >
            <Head title="Buat Tagihan PO" />
            <div className="space-y-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tagihan</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>No. Bukti Tagihan</Label>
                            <Input value={data.no_bukti_tagihan} onChange={(e) => setData('no_bukti_tagihan', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Penerimaan Barang (LPB)</Label>
                            <SearchableSelect
                                items={lpbList.map((l) => ({
                                    key: l.id,
                                    value: l.id,
                                    label: `${l.no_laporan_barang} (PO: ${l.purchase_order?.no_po ?? '-'})`,
                                }))}
                                value={data.id_penerimaan_barang}
                                onChange={handleLpbChange}
                                placeholder="Pilih Penerimaan Barang"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Karyawan</Label>
                            <SearchableSelect
                                items={karyawans.map((k) => ({ key: String(k.id), value: String(k.id), label: k.nama ?? '' }))}
                                value={data.id_karyawan}
                                onChange={(val) => setData('id_karyawan', val)}
                                placeholder="Pilih Karyawan"
                            />
                            {errors.id_karyawan && <p className="text-sm text-red-500">{errors.id_karyawan}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Invoice Vendor</Label>
                            <Input value={data.invoice_vendor} onChange={(e) => setData('invoice_vendor', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Periode</Label>
                            <Input value={data.periode} onChange={(e) => setData('periode', Number(e.target.value))} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Gudang</Label>
                            <Input value={data.gudang} onChange={(e) => setData('gudang', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Tanggal Transaksi</Label>
                            <Input
                                type="date"
                                value={data.tanggal_transaksi}
                                onChange={(e) => setData('tanggal_transaksi', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tanggal Jatuh Tempo</Label>
                            <Input type="date" value={data.jatuh_tempo} onChange={(e) => setData('jatuh_tempo', e.target.value)} required />
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <Label>Keterangan</Label>
                            <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Item Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="w-90 p-2 text-left">Item Name</th>
                                    <th className="w-20 p-2 text-center">Qty</th>
                                    <th className="w-20 p-2 text-center">Harga</th>
                                    <th className="w-20 p-2 text-center">Discount (%)</th>
                                    <th className="w-20 p-2 text-center">Sub Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">
                                            <Input value={item.master_item} readOnly />
                                        </td>
                                        <td className="p-2">
                                            <Input type="number" value={item.qty} readOnly />
                                        </td>
                                        <td className="p-2">
                                            <Input type="number" value={item.harga_per_qty} readOnly />
                                        </td>
                                        <td className="p-2">
                                            <Input type="number" value={item.discount} readOnly />
                                        </td>

                                        <td className="p-2 font-bold">
                                            {(item.qty * item.harga_per_qty - (item.qty * item.harga_per_qty * item.discount) / 100).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4">
                            <div className="mt-4 space-y-1 text-right">
                                <div>
                                    Total Nilai Barang :<span className="font-bold">{rupiah(totalNilaiBarang)}</span>
                                </div>

                                <div>
                                    PPN :<span className="font-bold">{rupiah(Number(data.ppn))}</span>
                                </div>

                                <div>
                                    Ongkir :<span className="font-bold">{rupiah(Number(data.ongkir))}</span>
                                </div>

                                <div>
                                    DP :<span className="font-bold">{rupiah(Number(data.dp))}</span>
                                </div>

                                <div className="border-t pt-2 text-lg">
                                    Total Akhir :<span className="text-primary font-bold">{rupiah(totalAkhir)}</span>
                                </div>
                            </div>
                            <Button onClick={handleSubmit} disabled={processing}>
                                Simpan Tagihan
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
