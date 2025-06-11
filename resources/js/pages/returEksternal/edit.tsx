/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ReturEksternal, ReturEksternalFormData } from '@/types/externalReturn';
import { PenerimaanBarang } from '@/types/penerimaanBarang';
import { Textarea } from '@headlessui/react';

import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Retur Eksternal', href: '/returEksternals' },
    { title: 'Edit Retur Eksternal', href: '#' },
];

interface Props {
    penerimaanBarangs: PenerimaanBarang[];
    returEksternal: ReturEksternal;
}

interface ItemReturn {
    id_penerimaan_barang_item: string;
    qty_retur: number;
    catatan_retur_item: string;
}

export default function EditReturEksternal({ penerimaanBarangs, returEksternal }: Props) {
    const [selectedPenerimaan, setSelectedPenerimaan] = useState<PenerimaanBarang | null>(null);
    const [itemReturns, setItemReturns] = useState<Record<string, ItemReturn>>({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editForm, setEditForm] = useState({ qty_retur: 0, catatan_retur_item: '' });

    const { data, setData, put, processing, errors, reset } = useForm<ReturEksternalFormData>({
        id_penerimaan_barang: returEksternal.id_penerimaan_barang || '',
        tgl_retur_barang: returEksternal.tgl_retur_barang?.split('T')[0] || new Date().toISOString().split('T')[0],
        nama_retur: returEksternal.nama_retur || '',
        catatan_retur: returEksternal.catatan_retur || '',
        items: [],
    });

    // Initialize data saat component mount
    useEffect(() => {
        // Set selected penerimaan barang
        if (returEksternal.penerimaan_barang) {
            setSelectedPenerimaan(returEksternal.penerimaan_barang);
        }

        // Initialize item returns dari data existing
        if (returEksternal.items && returEksternal.items.length > 0) {
            const existingReturns: Record<string, ItemReturn> = {};
            returEksternal.items.forEach((item) => {
                existingReturns[item.id_penerimaan_barang_item] = {
                    id_penerimaan_barang_item: item.id_penerimaan_barang_item,
                    qty_retur: item.qty_retur,
                    catatan_retur_item: item.catatan_retur_item || '',
                };
            });
            setItemReturns(existingReturns);
        }
    }, [returEksternal]);

    const handlePenerimaanChange = async (value: string) => {
        const penerimaan = penerimaanBarangs.find((p) => p.id === value);
        if (penerimaan) {
            setSelectedPenerimaan(penerimaan);
            setData((prev) => ({
                ...prev,
                id_penerimaan_barang: value,
            }));

            // Reset item returns ketika ganti penerimaan (kecuali masih sama)
            if (value !== returEksternal.id_penerimaan_barang) {
                setItemReturns({});
            }
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
        if (editingItem && editForm.qty_retur >= 0) {
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

        const validItems = Object.values(itemReturns).filter((item) => item.qty_retur > 0);

        if (validItems.length === 0) {
            toast.error('Pilih minimal satu item untuk diretur');
            return;
        }

        setData('items', validItems);

        put(`/returEksternals/${returEksternal.id}`, {
            onSuccess: () => {
                toast.success('Retur eksternal berhasil diupdate');
            },
            onError: () => {
                toast.error('Gagal mengupdate retur eksternal');
            },
        });
    };

    const getSatuanName = (item: any) => {
        return item.purchase_order_item?.master_konversi?.nama_satuan || item.purchase_order_item?.satuan?.nama_satuan || 'PIECES';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Retur Eksternal - ${returEksternal.no_retur}`} />

            <div className="mx-5 py-5">
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Retur Eksternal</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Form Edit Retur Eksternal</span>
                            <span className="rounded bg-gray-100 px-3 py-1 font-mono text-sm">{returEksternal.no_retur}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="no_laporan_barang">No. Laporan Penerimaan Barang *</Label>
                                    <Select value={data.id_penerimaan_barang} onValueChange={handlePenerimaanChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih No. Laporan Penerimaan Barang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {penerimaanBarangs.map((penerimaan) => (
                                                <SelectItem key={penerimaan.id} value={penerimaan.id}>
                                                    {penerimaan.no_laporan_barang}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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

                                <div className="space-y-2">
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
                                        <Input
                                            value={
                                                selectedPenerimaan.tgl_terima_barang
                                                   ? new Date(selectedPenerimaan.tgl_terima_barang).toLocaleDateString('id-ID')
                                                    : ''
                                            }
                                            disabled
                                            className="bg-gray-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>No Surat Jalan Pengiriman</Label>
                                        <Input value={selectedPenerimaan.no_surat_jalan} disabled className="bg-gray-100" />
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
                                <Button type="button" onClick={handleSubmit} disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                    {processing ? 'MENYIMPAN...' : 'UPDATE'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Form Edit Retur Barang</DialogTitle>
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

