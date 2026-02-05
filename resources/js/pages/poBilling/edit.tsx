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
import { PoBilling, PoBillingDetail } from '@/types/poBilling';
import { Head, useForm } from '@inertiajs/react';

interface EditProps {
    poBilling: PoBilling; // Data yang akan diedit
    karyawans: Karyawan[];
    lpbList: PenerimaanBarang[];
}

interface PoBillingForm extends Record<string, any> {
    no_bukti_tagihan: string;
    id_karyawan: string;
    id_purchase_order: string;
    id_penerimaan_barang: string;
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

export default function Edit({ poBilling, karyawans, lpbList }: EditProps) {
    const { data, setData, put, processing, errors, transform } = useForm<PoBillingForm>({
        no_bukti_tagihan: poBilling.no_bukti_tagihan ?? '',
        id_karyawan: String(poBilling.id_karyawan),
        id_purchase_order: String(poBilling.id_purchase_order),
        id_penerimaan_barang: String(poBilling.id_penerimaan_barang),
        gudang: poBilling.gudang ?? '',
        periode: poBilling.periode ?? new Date().getFullYear(),
        tanggal_transaksi: poBilling.tanggal_transaksi ?? '',
        jatuh_tempo: poBilling.jatuh_tempo ?? '',
        ongkir: Number(poBilling.ongkir) || 0,
        total_nilai_barang: Number(poBilling.total_nilai_barang) || 0,
        ppn: Number(poBilling.ppn) || 0,
        dp: Number(poBilling.dp) || 0,
        total_akhir: Number(poBilling.total_akhir) || 0,
        invoice_vendor: poBilling.invoice_vendor ?? '',
        keterangan: poBilling.keterangan ?? '',
        items: poBilling.details || [],
    });

    const handleLpbChange = (lpbId: string) => {
        const selectedLpb = lpbList.find((lpb) => String(lpb.id) === lpbId);
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
            } as any;
        });

        const totalNilaiBarangRaw = mappedItems.reduce((sum, item) => sum + item.total, 0);
        const ppnPersen = po?.ppn ?? 0;
        const ppnNominal = totalNilaiBarangRaw * (ppnPersen / 100);

        setData((prev) => ({
            ...prev,
            id_penerimaan_barang: String(selectedLpb.id),
            id_purchase_order: String(selectedLpb.id_purchase_order),
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

    const totalAkhir = totalNilaiBarang + (Number(data.ppn) || 0) + (Number(data.ongkir) || 0) - (Number(data.dp) || 0);

    const rupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((formData) => ({
            ...formData,
            total_nilai_barang: totalNilaiBarang,
            total_akhir: totalAkhir,
        }));

        put(route('poBillings.update', poBilling.id));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Billing', href: route('poBillings.index') },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title={`Edit Tagihan - ${data.no_bukti_tagihan}`} />
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Tagihan: {poBilling.no_bukti_tagihan}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>No. Bukti Tagihan</Label>
                            <Input value={data.no_bukti_tagihan} onChange={(e) => setData('no_bukti_tagihan', e.target.value)} readOnly />
                            {errors.no_bukti_tagihan && <p className="text-sm text-red-500">{errors.no_bukti_tagihan}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Penerimaan Barang (LPB)</Label>
                            <SearchableSelect
                                items={lpbList.map((l) => ({
                                    key: String(l.id),
                                    value: String(l.id),
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
                            <Input type="number" value={data.periode} onChange={(e) => setData('periode', Number(e.target.value))} required />
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
                    <CardHeader>
                        <CardTitle>Item Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2 text-left">Item Name</th>
                                        <th className="w-24 p-2 text-center">Qty</th>
                                        <th className="w-32 p-2 text-center">Harga</th>
                                        <th className="w-24 p-2 text-center">Discount (%)</th>
                                        <th className="w-32 p-2 text-right">Sub Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-2">
                                                <Input value={item.master_item} readOnly className="bg-muted" />
                                            </td>
                                            <td className="p-2">
                                                <Input type="number" value={item.qty} readOnly className="bg-muted text-center" />
                                            </td>
                                            <td className="p-2">
                                                <Input type="number" value={item.harga_per_qty} readOnly className="bg-muted text-center" />
                                            </td>
                                            <td className="p-2">
                                                <Input type="number" value={item.discount} readOnly className="bg-muted text-center" />
                                            </td>
                                            <td className="p-2 text-right font-medium">
                                                {rupiah(item.qty * item.harga_per_qty - (item.qty * item.harga_per_qty * item.discount) / 100)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex flex-col items-end space-y-2">
                            <div className="grid grid-cols-2 gap-x-4 text-sm">
                                <span className="text-right">Total Nilai Barang:</span>
                                <span className="font-bold">{rupiah(totalNilaiBarang)}</span>

                                <span className="text-right">PPN:</span>
                                <span className="font-bold text-orange-600">{rupiah(Number(data.ppn))}</span>

                                <span className="text-right">Ongkir:</span>
                                <span className="font-bold text-green-600">{rupiah(Number(data.ongkir))}</span>

                                <span className="text-right">DP:</span>
                                <span className="font-bold text-red-600">({rupiah(Number(data.dp))})</span>
                            </div>

                            <div className="mt-2 grid grid-cols-2 gap-x-4 border-t pt-2">
                                <span className="text-right text-lg font-semibold">Total Akhir:</span>
                                <span className="text-primary text-lg font-bold">{rupiah(totalAkhir)}</span>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Perbarui Tagihan'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </AppLayout>
    );
}
