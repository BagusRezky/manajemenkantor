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
import { TransFaktur, TransFakturDetail } from '@/types/transFaktur';
import { Head, useForm } from '@inertiajs/react';
import { Calculator, FileText, Package, Plus, Save, Tag, Trash2, User } from 'lucide-react';
import { useEffect } from 'react';

interface EditProps {
    item: TransFaktur; // Data faktur yang sedang diedit
    purchaseOrders: PurchaseOrder[];
    karyawans: Karyawan[];
}

export default function Edit({ item, purchaseOrders, karyawans }: EditProps) {
    // Inisialisasi useForm dengan data dari prop 'item'
    const { data, setData, put, processing, errors } = useForm<any>({
        no_faktur: item.no_faktur || '',
        no_invoice: item.no_invoice || '',
        id_purchase_order: item.id_purchase_order ? String(item.id_purchase_order) : '',
        no_po_asal: item.no_po_asal || '',
        tanggal_transaksi: item.tanggal_transaksi || '',
        gudang: item.gudang || 'UGRMS',
        periode: item.periode ? String(item.periode) : '',
        kode_customer: item.kode_customer || '',
        npwp: item.npwp || '',
        alamat: item.alamat || '',
        id_karyawan: item.id_karyawan ? String(item.id_karyawan) : '',
        total_dpp: item.total_dpp || 0,
        total_ppn: item.total_ppn || 0,
        grand_total: item.grand_total || 0,
        // Pastikan mapping detail sudah benar
        items:
            item.details?.map((d: TransFakturDetail) => ({
                master_item: d.master_item,
                qty: Number(d.qty),
                harga_per_qty: Number(d.harga_per_qty),
                unit: d.unit || 'PCS',
                ppn_persen: Number(d.ppn_persen || 11),
                subtotal: Number(d.subtotal),
                ppn_nilai: Number(d.ppn_nilai),
                total_item: Number(d.total_item),
                keterangan: d.keterangan || '',
                // Kita asumsikan diskon_satuan dihitung dari (qty * harga) - subtotal jika tidak ada di DB
                diskon_satuan: (Number(d.qty) * Number(d.harga_per_qty) - Number(d.subtotal)) / Number(d.qty) || 0,
            })) || [],
    });

    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    // Logika Auto-fill saat PO diganti (Sama dengan Create)
    const handlePOChange = (poId: string) => {
        const selectedPO = purchaseOrders.find((p) => String(p.id) === poId);
        if (selectedPO) {
            const mappedItems = (selectedPO.purchaseOrderItems || selectedPO.items || []).map((i: any) => {
                const disc = Number(i.diskon_satuan || 0);
                const sub = Number(i.qty_po) * (Number(i.harga_satuan) - disc);
                const pValue = sub * (Number(selectedPO.ppn || 0) / 100);
                return {
                    master_item: i.master_item?.nama_master_item || i.master_item?.nama_item || '-',
                    qty: i.qty_po,
                    harga_per_qty: i.harga_satuan,
                    diskon_satuan: disc,
                    unit: i.satuan?.nama_satuan || 'PCS',
                    ppn_persen: selectedPO.ppn || 0,
                    subtotal: sub,
                    ppn_nilai: pValue,
                    total_item: sub + pValue,
                    keterangan: i.remark_item_po || '',
                };
            });

            setData((prev: any) => ({
                ...prev,
                id_purchase_order: poId,
                no_po_asal: selectedPO.no_po,
                kode_customer: selectedPO.supplier?.nama_suplier || '-',
                alamat: selectedPO.supplier?.alamat_lengkap || '-',
                items: mappedItems,
            }));
        }
    };

    // Kalkulasi Grand Total saat items berubah
    useEffect(() => {
        const dpp = data.items.reduce((sum: number, i: any) => sum + Number(i.subtotal), 0);
        const ppn = data.items.reduce((sum: number, i: any) => sum + Number(i.ppn_nilai), 0);
        setData((prev: any) => ({
            ...prev,
            total_dpp: dpp,
            total_ppn: ppn,
            grand_total: dpp + ppn,
        }));
    }, [data.items]);

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        const itm = { ...newItems[index], [field]: value };

        // Kalkulasi baris: (Harga - Diskon) * Qty
        const netHarga = Number(itm.harga_per_qty) - Number(itm.diskon_satuan || 0);
        itm.subtotal = Number(itm.qty) * netHarga;
        itm.ppn_nilai = itm.subtotal * (Number(itm.ppn_persen) / 100);
        itm.total_item = itm.subtotal + itm.ppn_nilai;

        newItems[index] = itm;
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Menggunakan put untuk update
        put(route('transFakturs.update', item.id));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Faktur', href: route('transFakturs.index') },
                { title: 'Edit Faktur', href: '#' },
            ]}
        >
            <Head title={`Edit Faktur - ${item.no_faktur}`} />

            <div className="mx-auto max-w-6xl space-y-8 p-6">
                <form onSubmit={handleSubmit}>
                    {/* SECTION 1: HEADER & SUPPLIER */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <Card className="border-t-4 border-t-orange-500 shadow-sm lg:col-span-2">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-orange-600" /> Edit Informasi Transaksi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="font-bold text-orange-700">Purchase Order Reff</Label>
                                    <SearchableSelect
                                        items={purchaseOrders.map((p) => ({
                                            key: String(p.id),
                                            value: String(p.id),
                                            label: `${p.no_po} - ${p.supplier?.nama_suplier || '-'}`,
                                        }))}
                                        onChange={handlePOChange}
                                        value={data.id_purchase_order}
                                        placeholder="Ganti referensi PO..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">No. Faktur</Label>
                                    <Input
                                        value={data.no_faktur}
                                        onChange={(e) => setData('no_faktur', e.target.value)}
                                        className="h-11 border-orange-200 font-bold"
                                    />
                                    {errors.no_faktur && <p className="text-xs text-red-500">{errors.no_faktur}</p>}
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
                                    <Label>Karyawan (PIC)</Label>
                                    <SearchableSelect
                                        items={karyawans.map((k) => ({ key: String(k.id), value: String(k.id), label: k.nama ?? '' }))}
                                        value={data.id_karyawan}
                                        onChange={(val: any) => setData('id_karyawan', val)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-emerald-500 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg text-emerald-700">
                                    <User className="h-5 w-5" /> Supplier
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Nama Vendor</Label>
                                    <p className="mt-1 font-bold text-slate-700 italic underline">{data.kode_customer || '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold tracking-widest text-blue-600 uppercase underline">NPWP</Label>
                                    <Input
                                        value={data.npwp}
                                        onChange={(e) => setData('npwp', e.target.value)}
                                        className="mt-1 h-10 border-blue-200"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Alamat</Label>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{data.alamat || '-'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* SECTION 2: ITEMS */}
                    <div className="mt-10 mb-4 flex items-center justify-between border-b pb-2">
                        <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-800">
                            <Package className="h-6 w-6 text-orange-600" /> Rincian Barang (Mode Edit)
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
                                        diskon_satuan: 0,
                                        unit: '',
                                        ppn_persen: 0,
                                        subtotal: 0,
                                        ppn_nilai: 0,
                                        total_item: 0,
                                        keterangan: '',
                                    },
                                ])
                            }
                            variant="outline"
                            className="border-orange-500 text-orange-600 hover:bg-orange-50"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Baris Baru
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {data.items.map((item: any, index: number) => (
                            <Card
                                key={index}
                                className="group relative overflow-hidden border-l-4 border-l-orange-500 transition-all hover:shadow-md"
                            >
                                <Button
                                    type="button"
                                    onClick={() =>
                                        setData(
                                            'items',
                                            data.items.filter((_: any, i: number) => i !== index),
                                        )
                                    }
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
                                        <div className="space-y-2 md:col-span-4">
                                            <Label className="text-[10px] font-black tracking-tighter text-slate-400 uppercase">Deskripsi</Label>
                                            <Input
                                                className="h-11 border-slate-200 font-semibold"
                                                value={item.master_item}
                                                onChange={(e) => updateItem(index, 'master_item', e.target.value)}
                                                readOnly
                                            />
                                            <Input
                                                className="h-8 bg-slate-50 text-xs italic"
                                                value={item.keterangan}
                                                onChange={(e) => updateItem(index, 'keterangan', e.target.value)}
                                                placeholder="Keterangan item..."
                                                readOnly
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 md:col-span-2">
                                            <div className="space-y-2">
                                                <Label className="block text-center text-[10px] font-black text-slate-400 uppercase">Qty</Label>
                                                <Input
                                                    type="number"
                                                    className="h-11 text-center font-bold"
                                                    value={item.qty}
                                                    onChange={(e) => updateItem(index, 'qty', Number(e.target.value))}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="block text-center text-[10px] font-black text-slate-400 uppercase">Unit</Label>
                                                <Input
                                                    className="h-11 text-center"
                                                    value={item.unit}
                                                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 md:col-span-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black text-slate-400 uppercase">Harga</Label>
                                                <Input
                                                    type="number"
                                                    className="h-11 font-mono"
                                                    value={item.harga_per_qty}
                                                    onChange={(e) => updateItem(index, 'harga_per_qty', Number(e.target.value))}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-1 text-[10px] font-black text-rose-500 uppercase">
                                                    <Tag className="h-3 w-3" /> Disc
                                                </Label>
                                                <Input
                                                    type="number"
                                                    className="h-11 border-rose-100 bg-rose-50 font-mono text-rose-600"
                                                    value={item.diskon_satuan}
                                                    onChange={(e) => updateItem(index, 'diskon_satuan', Number(e.target.value))}
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-right md:col-span-2">
                                            <Label className="text-[10px] font-black tracking-tighter text-blue-600 uppercase">Total Baris</Label>
                                            <div className="flex h-11 items-center justify-end font-mono text-lg font-black text-slate-900 underline decoration-orange-300">
                                                {formatIDR(item.total_item)}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* SECTION 3: FOOTER SUMMARY */}
                    <div className="mt-10 flex justify-end">
                        <Card className="relative w-full overflow-hidden rounded-[2rem] border-none bg-slate-900 text-white shadow-2xl lg:w-[450px]">
                            <div className="absolute -right-4 -bottom-4 opacity-5">
                                <Calculator className="h-40 w-40" />
                            </div>
                            <CardContent className="space-y-6 p-10">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-medium text-slate-400">
                                        <span>Total DPP</span>
                                        <span className="font-mono">{formatIDR(data.total_dpp)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-slate-400">
                                        <span>Total PPN</span>
                                        <span className="font-mono text-emerald-400">+{formatIDR(data.total_ppn)}</span>
                                    </div>
                                </div>
                                <Separator className="bg-slate-700" />
                                <div className="space-y-6">
                                    <div>
                                        <p className="mb-2 text-[10px] font-black tracking-[0.3em] text-orange-400 uppercase">Update Total Akhir</p>
                                        <h2 className="font-mono text-4xl font-black tracking-tighter text-white">{formatIDR(data.grand_total)}</h2>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex h-16 w-full gap-2 rounded-2xl bg-orange-600 text-lg font-black shadow-xl shadow-orange-900/40 transition-all hover:bg-orange-500 active:scale-95"
                                    >
                                        <Save className="h-6 w-6" />
                                        {processing ? 'SEDANG MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
