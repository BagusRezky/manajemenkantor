/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchableSelect } from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Karyawan } from '@/types/karyawan';
import { PurchaseOrder } from '@/types/purchaseOrder';
import { Head, useForm } from '@inertiajs/react';
import { FileText, Package, Percent, Plus, Trash2, User } from 'lucide-react';
import { useEffect } from 'react';

interface TransFakturForm {
    [key: string]: any;
    no_faktur: string;
    no_invoice: string;
    id_purchase_order: string;
    no_po_asal: string;
    tanggal_transaksi: string;
    gudang: string;
    periode: string;
    kode_customer: string;
    npwp: string;
    alamat: string;
    id_karyawan: string;
    total_dpp: number;
    total_ppn: number;
    grand_total: number;
    items: any[];
}

interface CreateProps {
    purchaseOrders: PurchaseOrder[];
    karyawans: Karyawan[];
}

export default function Create({ purchaseOrders, karyawans }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<TransFakturForm>({
        no_faktur: '',
        no_invoice: '',
        id_purchase_order: '',
        no_po_asal: '',
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        gudang: 'UGRMS',
        periode: new Date().getFullYear().toString(),
        kode_customer: '',
        npwp: '',
        alamat: '',
        id_karyawan: '',
        total_dpp: 0,
        total_ppn: 0,
        grand_total: 0,
        items: [],
    });

    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const handlePOChange = (poId: string) => {
        const selectedPO = purchaseOrders.find((p) => String(p.id) === poId);
        if (selectedPO) {
            const mappedItems = (selectedPO.purchaseOrderItems || selectedPO.items || []).map((item) => {
                const qty = Number(item.qty_po || 0);
                const hargaSatuan = Number(item.harga_satuan || 0);
                const diskonPersen = Number(item.diskon_satuan || 0); // Nilai asli % (misal 5.44)

                // LOGIKA PEMBULATAN SESUAI CONTOH:
                // 1. Hitung Gross Total Line
                const grossTotalLine = qty * hargaSatuan;
                // 2. Hitung Estimasi Total Setelah Diskon
                const rawTotalAfterDisc = grossTotalLine * (1 - diskonPersen / 100);
                // 3. Bulatkan Hasil Akhir ke Ratusan Terdekat (1.134.720 -> 1.134.700)
                const subtotalDibulatkan = Math.round(rawTotalAfterDisc / 100) * 100;

                // Hitung Nominal Diskon Satuan untuk DB (Total Diskon / Qty)
                const totalNominalDiskon = grossTotalLine - subtotalDibulatkan;
                const nominalDiskonPerUnit = totalNominalDiskon / qty;

                const ppn_nilai = subtotalDibulatkan * (Number(selectedPO.ppn || 0) / 100);

                return {
                    master_item: item.master_item?.nama_master_item || item.master_item?.nama_master_item || '-',
                    qty: qty,
                    harga_per_qty: hargaSatuan,
                    diskon_persen: diskonPersen, // Untuk Tampilan UI (5.44%)
                    diskon_satuan: nominalDiskonPerUnit, // Untuk DB (Angka Rupiah)
                    unit: item.satuan?.nama_satuan || 'PCS',
                    ppn_persen: selectedPO.ppn || 0,
                    subtotal: subtotalDibulatkan,
                    ppn_nilai: ppn_nilai,
                    total_item: subtotalDibulatkan + ppn_nilai,
                    keterangan: item.remark_item_po || '',
                };
            });

            setData((prev) => ({
                ...prev,
                id_purchase_order: poId,
                no_po_asal: selectedPO.no_po,
                kode_customer: selectedPO.supplier?.nama_suplier || '-',
                alamat: selectedPO.supplier?.alamat_lengkap || '-',
                items: mappedItems,
            }));
        }
    };

    useEffect(() => {
        const dpp = data.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
        const ppn = data.items.reduce((sum, item) => sum + Number(item.ppn_nilai), 0);
        setData((prev) => ({ ...prev, total_dpp: dpp, total_ppn: ppn, grand_total: dpp + ppn }));
    }, [data.items]);

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        const item = { ...newItems[index], [field]: value };

        // Re-kalkulasi Manual jika ada perubahan
        const gross = Number(item.qty) * Number(item.harga_per_qty);
        const rawTotal = gross * (1 - Number(item.diskon_persen) / 100);
        const subtotal = Math.round(rawTotal / 100) * 100;

        item.diskon_satuan = (gross - subtotal) / Number(item.qty);
        item.subtotal = subtotal;
        item.ppn_nilai = subtotal * (Number(item.ppn_persen) / 100);
        item.total_item = subtotal + item.ppn_nilai;

        newItems[index] = item;
        setData('items', newItems);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Faktur', href: route('transFakturs.index') },
                { title: 'Create', href: '#' },
            ]}
        >
            <Head title="Buat Faktur Baru" />

            <div className="mx-auto max-w-6xl space-y-8 p-6">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(route('transFakturs.store'));
                    }}
                >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* HEADER */}
                        <Card className="border-t-4 border-t-blue-600 shadow-sm lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-blue-600" /> Informasi Transaksi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="font-bold text-blue-700 underline">Purchase Order Reff</Label>
                                    <SearchableSelect
                                        items={purchaseOrders.map((p) => ({
                                            key: String(p.id),
                                            value: String(p.id),
                                            label: `${p.no_po} - ${p.supplier?.nama_suplier || '-'}`,
                                        }))}
                                        onChange={handlePOChange}
                                        value={data.id_purchase_order}
                                    />
                                    {errors.id_purchase_order && <p className="text-sm text-red-600">{errors.id_purchase_order}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">No. Faktur</Label>
                                    <Input
                                        value={data.no_faktur}
                                        onChange={(e) => setData('no_faktur', e.target.value)}
                                        placeholder="000.000..."
                                        className="h-11 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>No. Invoice</Label>
                                    <Input value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)} className="h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tanggal Transaksi</Label>
                                    <Input
                                        type="date"
                                        value={data.tanggal_transaksi}
                                        onChange={(e) => setData('tanggal_transaksi', e.target.value)}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Gudang</Label>
                                    <Input value={data.gudang} onChange={(e) => setData('gudang', e.target.value)} className="h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label>PIC</Label>
                                    <SearchableSelect
                                        items={karyawans.map((k) => ({ key: String(k.id), value: String(k.id), label: k.nama ?? '' }))}
                                        value={data.id_karyawan}
                                        onChange={(val) => setData('id_karyawan', val)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* SUPPLIER */}
                        <Card className="border-t-4 border-t-emerald-500 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-emerald-700">
                                    <User className="h-5 w-5" /> Supplier
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase">Vendor</Label>
                                    <p className="font-bold text-slate-700">{data.kode_customer || '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold text-blue-600 uppercase underline">NPWP (Manual)</Label>
                                    <Input
                                        value={data.npwp}
                                        onChange={(e) => setData('npwp', e.target.value)}
                                        className="mt-1 h-10 border-blue-200"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase">Alamat</Label>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{data.alamat || '-'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ITEM CARDS */}
                    <div className="mt-10 mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-xl font-black text-slate-800">
                            <Package className="h-6 w-6 text-blue-600" /> Rincian Barang
                        </h2>
                        <Button
                            type="button"
                            onClick={() =>
                                setData('items', [
                                    ...data.items,
                                    {
                                        master_item: '',
                                        qty: 1,
                                        harga_per_qty: 0,
                                        diskon_persen: 0,
                                        diskon_satuan: 0,
                                        unit: 'PCS',
                                        ppn_persen: 11,
                                        subtotal: 0,
                                        ppn_nilai: 0,
                                        total_item: 0,
                                        keterangan: '',
                                    },
                                ])
                            }
                            variant="secondary"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Tambah Baris
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {data.items.map((item, index) => (
                            <Card key={index} className="group relative border-l-4 border-l-blue-500 transition-all hover:shadow-md">
                                <Button
                                    type="button"
                                    onClick={() =>
                                        setData(
                                            'items',
                                            data.items.filter((_, i) => i !== index),
                                        )
                                    }
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                                        <div className="space-y-2 md:col-span-4">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase">Deskripsi</Label>
                                            <Input
                                                className="h-11 font-semibold"
                                                value={item.master_item}
                                                onChange={(e) => updateItem(index, 'master_item', e.target.value)}
                                                readOnly
                                            />
                                            <Input
                                                className="h-8 text-xs italic"
                                                value={item.keterangan}
                                                onChange={(e) => updateItem(index, 'keterangan', e.target.value)}
                                                readOnly
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 md:col-span-2">
                                            <div>
                                                <Label className="text-[10px] font-bold text-slate-400">Qty</Label>
                                                <Input type="number" className="h-11 text-center font-bold" value={item.qty} readOnly />
                                            </div>
                                            <div>
                                                <Label className="text-[10px] font-bold text-slate-400">Unit</Label>
                                                <Input className="h-11 text-center" value={item.unit} readOnly />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 md:col-span-4">
                                            <div>
                                                <Label className="text-[10px] font-bold text-slate-400">Harga Satuan</Label>
                                                <Input type="number" className="h-11 font-mono" value={item.harga_per_qty} readOnly />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="flex items-center gap-1 text-[10px] font-black text-rose-500 uppercase">
                                                    <Percent className="h-3 w-3" /> Diskon
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        className="h-11 border-rose-100 bg-rose-50/30 pr-8 font-bold text-rose-600"
                                                        value={item.diskon_persen}
                                                        onChange={(e) => updateItem(index, 'diskon_persen', Number(e.target.value))}
                                                    />
                                                    <span className="absolute top-3 right-3 text-[10px] font-bold text-rose-400">%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-right md:col-span-2">
                                            <Label className="text-[10px] font-black text-blue-600 uppercase">Total (Dibulatkan)</Label>
                                            <div className="flex h-11 items-center justify-end border-b font-mono text-lg font-black text-slate-900">
                                                {formatIDR(item.subtotal)}
                                            </div>
                                            <p className="text-[9px] text-slate-400 italic">
                                                Asli: {formatIDR(item.qty * item.harga_per_qty * (1 - item.diskon_persen / 100))}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* GRAND TOTAL */}
                    <div className="mt-10 flex justify-end">
                        <Card className="w-full rounded-[2.5rem] border-none bg-slate-900 text-white shadow-2xl lg:w-[450px]">
                            <CardContent className="space-y-6 p-10">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Subtotal (DPP)</span>
                                        <span className="font-mono">{formatIDR(data.total_dpp)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Total PPN</span>
                                        <span className="font-mono text-emerald-400">+{formatIDR(data.total_ppn)}</span>
                                    </div>
                                </div>
                                <Separator className="bg-slate-700" />
                                <div>
                                    <p className="mb-2 text-[10px] font-black tracking-widest text-blue-400 uppercase">Grand Total</p>
                                    <h2 className="font-mono text-4xl font-black tracking-tighter text-white">{formatIDR(data.grand_total)}</h2>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-16 w-full rounded-2xl bg-blue-600 text-lg font-black shadow-xl shadow-blue-900/40 hover:bg-blue-500"
                                >
                                    {processing ? 'MEMPROSES...' : 'SIMPAN FAKTUR'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
