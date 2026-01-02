/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ImrDiemaking } from '@/types/imrDiemaking';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    imrDiemaking: ImrDiemaking;
    kartuInstruksiKerjas: KartuInstruksiKerja[];
}

export default function EditImrDiemaking({ imrDiemaking, kartuInstruksiKerjas }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'IMR Diemaking', href: '/imrDiemakings' },
        { title: 'Edit IMR', href: '#' },
    ];

    const [selectedKik, setSelectedKik] = useState<KartuInstruksiKerja | null>(null);
    const [itemRequests, setItemRequests] = useState<Record<string, any>>({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editForm, setEditForm] = useState({ qty_request: 0 });

    const { data, setData, processing, errors } = useForm({
        id_kartu_instruksi_kerja: imrDiemaking.id_kartu_instruksi_kerja,
        // Format YYYY-MM-DD untuk input type date
        tgl_request: imrDiemaking.tgl_request ? imrDiemaking.tgl_request.split(' ')[0] : '',
    });

    // Inisialisasi data saat komponen dimuat
    useEffect(() => {
        const currentKik = kartuInstruksiKerjas.find((k) => k.id === imrDiemaking.id_kartu_instruksi_kerja);
        if (currentKik) setSelectedKik(currentKik);

        if (imrDiemaking.items) {
            const initialRequests: Record<string, any> = {};
            imrDiemaking.items.forEach((item) => {
                initialRequests[item.id_kartu_instruksi_kerja_bom] = {
                    id_kartu_instruksi_kerja_bom: item.id_kartu_instruksi_kerja_bom,
                    qty_request: item.qty_request,
                };
            });
            setItemRequests(initialRequests);
        }
    }, [imrDiemaking]);

    const handleEditItem = (item: any) => {
        setEditingItem(item);
        // Ambil qty dari state lokal agar perubahan tidak hilang sebelum disubmit
        const existingQty = itemRequests[item.id]?.qty_request || 0;
        setEditForm({ qty_request: existingQty });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (editingItem) {
            setItemRequests((prev) => ({
                ...prev,
                [editingItem.id]: {
                    id_kartu_instruksi_kerja_bom: editingItem.id,
                    qty_request: editForm.qty_request,
                },
            }));
            setIsEditModalOpen(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validItems = Object.values(itemRequests).filter((item: any) => item.qty_request > 0);

        if (validItems.length === 0) {
            toast.error('Minimal harus ada 1 item dengan kuantitas > 0');
            return;
        }

        router.put(
            route('imrDiemakings.update', imrDiemaking.id),
            {
                ...data,
                items: validItems,
            },
            {
                onSuccess: () => toast.success('Data IMR Diemaking berhasil diperbarui'),
                onError: () => toast.error('Gagal memperbarui data'),
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit IMR Diemaking - ${imrDiemaking.no_imr_diemaking}`} />

            <div className="mx-5 py-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Edit IMR Diemaking: {imrDiemaking.no_imr_diemaking}</CardTitle>
                        <Link href={route('imrDiemakings.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>No. SPK (KIK) *</Label>
                                    <Input value={selectedKik?.no_kartu_instruksi_kerja || ''} disabled className="bg-gray-100" />
                                    <p className="text-muted-foreground text-xs italic">Ganti SPK hanya tersedia pada menu Tambah Baru</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tanggal Request *</Label>
                                    <Input
                                        type="date"
                                        value={data.tgl_request}
                                        onChange={(e) => setData('tgl_request', e.target.value)}
                                        className={errors.tgl_request ? 'border-red-500' : ''}
                                    />
                                    {errors.tgl_request && <p className="text-xs text-red-500">{errors.tgl_request}</p>}
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Departemen</th>
                                            <th className="px-4 py-3 text-left">Kode - Nama Material</th>
                                            <th className="px-4 py-3 text-left">Satuan</th>
                                            <th className="px-4 py-3 text-left">Total Kebutuhan</th>
                                            <th className="px-4 py-3 text-left">Qty Request</th>
                                            <th className="w-20 px-4 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {selectedKik?.kartu_instruksi_kerja_boms?.map((item: any) => (
                                            <tr key={item.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="px-4 py-3">{item.bill_of_materials?.departemen?.nama_departemen || '-'}</td>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-900">
                                                        {item.bill_of_materials?.master_item?.nama_master_item}
                                                    </p>
                                                    <p className="font-mono text-xs text-gray-500">
                                                        {item.bill_of_materials?.master_item?.kode_master_item}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">{item.bill_of_materials?.master_item?.unit?.nama_satuan}</td>
                                                <td className="px-4 py-3 font-mono">{item.total_kebutuhan}</td>
                                                <td className="px-4 py-3 font-bold text-blue-600">{itemRequests[item.id]?.qty_request || '0'}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditItem(item)}
                                                        disabled={imrDiemaking.status !== 'pending'}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => window.history.back()}>
                                    BATAL
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || imrDiemaking.status !== 'pending'}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                                </Button>
                            </div>
                            {imrDiemaking.status !== 'pending' && (
                                <p className="text-center text-sm font-medium text-red-500 italic">
                                    IMR ini sudah berstatus {imrDiemaking.status}, data tidak dapat diubah lagi.
                                </p>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Edit Qty */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Kuantitas Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Material</Label>
                            <p className="font-medium">{editingItem?.bill_of_materials?.master_item?.nama_master_item}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Total Kebutuhan</Label>
                                <p className="font-mono">{editingItem?.total_kebutuhan}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Satuan</Label>
                                <p>{editingItem?.bill_of_materials?.master_item?.unit?.nama_satuan}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="qty_request">Input Qty Baru *</Label>
                            <Input
                                id="qty_request"
                                type="number"
                                step="0.01"
                                min="0"
                                value={editForm.qty_request}
                                onChange={(e) => setEditForm({ qty_request: parseFloat(e.target.value) || 0 })}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            BATAL
                        </Button>
                        <Button onClick={handleSaveEdit} className="bg-blue-600">
                            UPDATE ITEM
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
