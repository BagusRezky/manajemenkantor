/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { InternalMaterialRequest } from '@/types/internalMaterialRequest';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    internalMaterialRequest: InternalMaterialRequest;
    kartuInstruksiKerjas: KartuInstruksiKerja[];
}

export default function EditInternalMaterialRequest({ internalMaterialRequest, kartuInstruksiKerjas }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Internal Material Request', href: '/internalMaterialRequests' },
        { title: 'Edit IMR', href: '#' },
    ];

    const [selectedKik, setSelectedKik] = useState<KartuInstruksiKerja | null>(null);
    const [itemRequests, setItemRequests] = useState<Record<string, any>>({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editForm, setEditForm] = useState({ qty_request: 0 });

    // Inisialisasi useForm
    const { data, setData, processing, errors } = useForm({
        id_kartu_instruksi_kerja: internalMaterialRequest.id_kartu_instruksi_kerja,
        // Pastikan format tanggal YYYY-MM-DD untuk input date
        tgl_request: internalMaterialRequest.tgl_request ? internalMaterialRequest.tgl_request.split(' ')[0] : '',
    });

    // Effect untuk load data awal
    useEffect(() => {
        const currentKik = kartuInstruksiKerjas.find((k) => k.id === internalMaterialRequest.id_kartu_instruksi_kerja);
        if (currentKik) setSelectedKik(currentKik);

        if (internalMaterialRequest.items) {
            const initialRequests: Record<string, any> = {};
            internalMaterialRequest.items.forEach((item) => {
                initialRequests[item.id_kartu_instruksi_kerja_bom] = {
                    id_kartu_instruksi_kerja_bom: item.id_kartu_instruksi_kerja_bom,
                    qty_request: item.qty_request,
                };
            });
            setItemRequests(initialRequests);
        }
    }, [internalMaterialRequest]);

    const handleEditItem = (item: any) => {
        setEditingItem(item);
        // Ambil qty dari state itemRequests agar sinkron saat diedit berkali-kali sebelum save
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

        // Ambil hanya item yang qty-nya > 0
        const itemsToSubmit = Object.values(itemRequests).filter((item: any) => item.qty_request > 0);

        if (itemsToSubmit.length === 0) {
            toast.error('Minimal harus ada 1 item dengan kuantitas > 0');
            return;
        }

        router.put(
            route('internalMaterialRequests.update', internalMaterialRequest.id),
            {
                ...data,
                items: itemsToSubmit,
            },
            {
                onSuccess: () => toast.success('Data IMR berhasil diperbarui'),
                onError: (err) => {
                    console.error(err);
                    toast.error('Gagal memperbarui data. Periksa kembali inputan Anda.');
                },
                preserveScroll: true, // Menjaga posisi scroll agar tidak lompat
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit IMR - ${internalMaterialRequest.no_imr}`} />

            <div className="mx-5 py-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Edit IMR: {internalMaterialRequest.no_imr}</CardTitle>
                        <Link href={route('internalMaterialRequests.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>SPK (No. Kik) *</Label>
                                    <Input value={selectedKik?.no_kartu_instruksi_kerja || ''} disabled className="bg-gray-100" />
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
                                            <th className="px-4 py-3 text-left">Material</th>
                                            <th className="px-4 py-3 text-left">Satuan</th>
                                            <th className="px-4 py-3 text-left">Qty Request</th>
                                            <th className="w-20 px-4 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {selectedKik?.kartu_instruksi_kerja_boms?.map((item: any) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3">{item.bill_of_materials?.departemen?.nama_departemen}</td>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium">{item.bill_of_materials?.master_item?.nama_master_item}</p>
                                                    <p className="text-xs text-gray-500">{item.bill_of_materials?.master_item?.kode_master_item}</p>
                                                </td>
                                                <td className="px-4 py-3">{item.bill_of_materials?.master_item?.unit?.nama_satuan}</td>
                                                <td className="px-4 py-3 font-bold text-blue-600">{itemRequests[item.id]?.qty_request || '0'}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Button type="button" variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                                    <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Edit Qty */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Kuantitas</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Label>Qty Request Baru</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={editForm.qty_request}
                            onChange={(e) => setEditForm({ qty_request: parseFloat(e.target.value) || 0 })}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSaveEdit}>Update Kuantitas</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
