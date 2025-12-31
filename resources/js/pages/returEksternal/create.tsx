/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PenerimaanBarang } from '@/types/penerimaanBarang';

import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@headlessui/react';
import { SearchableSelect } from '@/components/search-select';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Retur Eksternal', href: '/returEksternals' },
    { title: 'Tambah Retur Eksternal', href: '/returEksternals/create' },
];

interface Props {
    penerimaanBarangs: PenerimaanBarang[];
}

interface ItemReturn {
    id_penerimaan_barang_item: string;
    qty_retur: number;
    catatan_retur_item: string;
}

export default function CreateReturEksternal({ penerimaanBarangs }: Props) {
    const [selectedPenerimaan, setSelectedPenerimaan] = useState<PenerimaanBarang | null>(null);
    const [itemReturns, setItemReturns] = useState<Record<string, ItemReturn>>({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editForm, setEditForm] = useState({ qty_retur: 0, catatan_retur_item: '' });

    // ✅ Simple useForm tanpa generic type
    const { data, setData, post, processing, errors, reset } = useForm({
        id_penerimaan_barang: '',
        tgl_retur_barang: new Date().toISOString().split('T')[0],
        nama_retur: '',
        catatan_retur: '',
        items: [] as any[],
    });

    useEffect(() => {
        const validItems = Object.values(itemReturns).filter((item) => item.qty_retur > 0);
        setData('items', validItems);
    }, [itemReturns]);

    const handlePenerimaanChange = (value: string) => {
        const penerimaan = penerimaanBarangs.find((p) => p.id === value);
        if (penerimaan) {
            setSelectedPenerimaan(penerimaan);
            setData('id_penerimaan_barang', value);
            setItemReturns({});
        }
    };

    const handleEditItem = (item: any) => {
        setEditingItem(item);
        const existingReturn = itemReturns[item.id] || { qty_retur: 0, catatan_retur_item: '' };
        setEditForm({
            qty_retur: existingReturn.qty_retur,
            catatan_retur_item: existingReturn.catatan_retur_item,
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (editingItem && editForm.qty_retur > 0) {
            setItemReturns((prev) => ({
                ...prev,
                [editingItem.id]: {
                    id_penerimaan_barang_item: editingItem.id,
                    qty_retur: editForm.qty_retur,
                    catatan_retur_item: editForm.catatan_retur_item,
                },
            }));
            setIsEditModalOpen(false);
            setEditingItem(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 'data.items' sekarang sudah SELALU up-to-date berkat useEffect.
        // Kita hanya perlu validasi menggunakan 'data.items' langsung.
        if (data.items.length === 0) {
            toast.error('Pilih minimal satu item untuk diretur');
            return;
        }

        // Hapus 'setData('items', validItems);'
        // Hapus 'setTimeout'

        // Langsung panggil post.
        // 'data' dari useForm hook sudah dijamin memiliki 'items' yang benar.
        post('/returEksternals', {
            onSuccess: () => {
                toast.success('Retur eksternal berhasil disimpan');
                reset();
                setItemReturns({}); // Ini sudah benar, me-reset state lokal
            },
            onError: (errors: any) => {
                console.error('Form errors:', errors);
                toast.error('Gagal menyimpan retur eksternal');
            },
        });
    };

    const getSatuanName = (item: any) => {
        return item.purchase_order_item?.master_konversi?.nama_satuan || item.purchase_order_item?.satuan?.nama_satuan || 'PIECES';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Retur Eksternal" />

            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Form Retur Eksternal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="no_laporan_barang">No. Laporan Penerimaan Barang *</Label>
                                    <SearchableSelect
                                        items={penerimaanBarangs.map((penerimaan) => ({
                                            key: penerimaan.id,
                                            value: penerimaan.id,
                                            label: penerimaan.no_laporan_barang,
                                        }))}
                                        value={data.id_penerimaan_barang}
                                        placeholder="Pilih No. Laporan Penerimaan Barang"
                                        onChange={handlePenerimaanChange}
                                    />
                                    {errors.id_penerimaan_barang && <p className="text-sm text-red-600">{errors.id_penerimaan_barang}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tgl_retur_barang">Tgl Retur Barang *</Label>
                                    <Input
                                        id="tgl_retur_barang"
                                        type="date"
                                        value={data.tgl_retur_barang}
                                        onChange={(e) => setData('tgl_retur_barang', e.target.value)}
                                        required
                                    />
                                    {errors.tgl_retur_barang && <p className="text-sm text-red-600">{errors.tgl_retur_barang}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="nama_retur">Nama Retur *</Label>
                                    <Input
                                        id="nama_retur"
                                        value={data.nama_retur}
                                        onChange={(e) => setData('nama_retur', e.target.value)}
                                        placeholder="Input nama retur"
                                        required
                                    />
                                    {errors.nama_retur && <p className="text-sm text-red-600">{errors.nama_retur}</p>}
                                </div>
                            </div>

                            {selectedPenerimaan && (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Tgl Penerimaan Barang</Label>
                                        <Input value={selectedPenerimaan.tgl_terima_barang || ''} disabled className="bg-gray-100" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>No Surat Jalan Pengiriman</Label>
                                        <Input value={selectedPenerimaan.no_surat_jalan || ''} disabled className="bg-gray-100" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Supplier</Label>
                                        <Input
                                            value={selectedPenerimaan.purchase_order?.supplier?.nama_suplier || ''}
                                            disabled
                                            className="bg-gray-100"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="catatan_retur">Catatan Retur</Label>
                                <Textarea
                                    id="catatan_retur"
                                    value={data.catatan_retur}
                                    onChange={(e) => setData('catatan_retur', e.target.value)}
                                    placeholder="Input catatan retur"
                                    rows={3}
                                />
                            </div>

                            {selectedPenerimaan && selectedPenerimaan.items && (
                                <div className="space-y-4">
                                    <div className="rounded-t-md bg-gray-800 p-3 text-white">
                                        <h3 className="text-center font-semibold">Data Item Penerimaan Barang</h3>
                                    </div>
                                    <div className="overflow-x-auto rounded-b-md border">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr className="border-b">
                                                    <th className="w-12 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        No
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Nama Item
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Qty | Satuan Penerimaan
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Catatan Penerimaan
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Qty | Satuan Return
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Catatan Retur
                                                    </th>
                                                    <th className="w-20 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {selectedPenerimaan.items.map((item, index) => {
                                                    const itemReturn = itemReturns[item.id];
                                                    return (
                                                        <tr key={item.id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{index + 1}</td>
                                                            <td className="px-4 py-4 text-sm text-gray-900">
                                                                {item.purchase_order_item?.master_item?.kode_master_item} -{' '}
                                                                {item.purchase_order_item?.master_item?.nama_master_item}
                                                            </td>
                                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                                {item.qty_penerimaan} | {getSatuanName(item)}
                                                            </td>
                                                            <td className="px-4 py-4 text-sm text-gray-900">{item.catatan_item || '-'}</td>
                                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                                {itemReturn ? `${itemReturn.qty_retur} | ${getSatuanName(item)}` : '-'}
                                                            </td>
                                                            <td className="px-4 py-4 text-sm text-gray-900">
                                                                {itemReturn?.catatan_retur_item || '-'}
                                                            </td>
                                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleEditItem(item)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    BATAL
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                                    {processing ? 'MENYIMPAN...' : 'RETUR'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Form Retur Barang</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Qty Retur *</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editForm.qty_retur}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, qty_retur: parseFloat(e.target.value) || 0 }))}
                                placeholder="0.00"
                            />
                            <p className="text-sm text-gray-600">
                                Qty Penerimaan: {editingItem?.qty_penerimaan} | Satuan Penerimaan: {editingItem ? getSatuanName(editingItem) : ''}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Satuan Retur *</Label>
                            <Input value={editingItem ? getSatuanName(editingItem) : ''} disabled className="bg-gray-100" />
                        </div>

                        <div className="space-y-2">
                            <Label>Catatan Retur Item</Label>
                            <Textarea
                                value={editForm.catatan_retur_item}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, catatan_retur_item: e.target.value }))}
                                placeholder="Input catatan retur item"
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            TUTUP
                        </Button>
                        <Button type="button" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                            PROSES
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
