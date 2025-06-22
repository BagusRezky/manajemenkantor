/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { InternalMaterialRequestFormData } from '@/types/internalMaterialRequest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Internal Material Request', href: '/internalMaterialRequests' },
    { title: 'Tambah IMR', href: '/internalMaterialRequests/create' },
];

interface Props {
    kartuInstruksiKerjas: KartuInstruksiKerja[];
    nextNoImr: string;
}

interface ItemRequest {
    id_kartu_instruksi_kerja_bom: string;
    qty_request: number;
}

export default function CreateInternalMaterialRequest({ kartuInstruksiKerjas, nextNoImr }: Props) {
    const [selectedKik, setSelectedKik] = useState<KartuInstruksiKerja | null>(null);
    const [itemRequests, setItemRequests] = useState<Record<string, ItemRequest>>({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editForm, setEditForm] = useState({ qty_request: 0 });

    const { data, setData, processing, errors, reset } = useForm<InternalMaterialRequestFormData>({
        id_kartu_instruksi_kerja: '',
        tgl_request: new Date().toISOString().split('T')[0],
        items: [],
    });

    const handleKikChange = (value: string) => {
        console.log('Selected KIK ID:', value); // Debug

        const kik = kartuInstruksiKerjas.find((k) => k.id === value);
        if (kik) {
            setSelectedKik(kik);
            setData('id_kartu_instruksi_kerja', value);
            setItemRequests({});

            console.log('Updated form data id_kartu_instruksi_kerja:', value); // Debug
        }
    };

    const handleEditItem = (item: any) => {
        setEditingItem(item);
        const existingRequest = itemRequests[item.id] || { qty_request: 0 };
        setEditForm({
            qty_request: existingRequest.qty_request
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (editingItem && editForm.qty_request >= 0) {
            setItemRequests(prev => ({
                ...prev,
                [editingItem.id]: {
                    id_kartu_instruksi_kerja_bom: editingItem.id,
                    qty_request: editForm.qty_request
                }
            }));
            setIsEditModalOpen(false);
            setEditingItem(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validItems = Object.values(itemRequests).filter((item) => item.qty_request > 0);

        if (validItems.length === 0) {
            toast.error('Pilih minimal satu item untuk direquest');
            return;
        }

        // Pastikan id_kartu_instruksi_kerja tidak kosong
        const kikId = selectedKik?.id || data.id_kartu_instruksi_kerja;

        if (!kikId) {
            toast.error('Pilih SPK terlebih dahulu');
            return;
        }

        const submitData = {
            id_kartu_instruksi_kerja: kikId, // Gunakan kikId yang sudah dipastikan tidak kosong
            tgl_request: data.tgl_request,
            items: validItems,
        } as any;

        console.log('Submitting data:', submitData); // Debug

        router.post('/internalMaterialRequests', submitData, {
            onSuccess: (page) => {
                console.log('Success response:', page);
                toast.success('Internal Material Request berhasil disimpan');
                reset();
                setSelectedKik(null); // Reset selected KIK
                setItemRequests({}); // Reset item requests
            },
            onError: (errors) => {
                console.log('Error response:', errors);
                toast.error('Gagal menyimpan Internal Material Request');
            },
            onFinish: () => {
                console.log('Request finished');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Internal Material Request" />

            <div className="mx-5 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Internal Material Request Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="no_kartu_instruksi_kerja">Surat Perintah Kerja *</Label>
                                    <Select onValueChange={handleKikChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kartu Instruksi Kerja" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kartuInstruksiKerjas.map((kik) => (
                                                <SelectItem key={kik.id} value={kik.id}>
                                                    {kik.no_kartu_instruksi_kerja}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.id_kartu_instruksi_kerja && (
                                        <p className="text-sm text-red-600">{errors.id_kartu_instruksi_kerja}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tgl_request">Tgl Request *</Label>
                                    <Input
                                        id="tgl_request"
                                        type="date"
                                        value={data.tgl_request}
                                        onChange={(e) => setData('tgl_request', e.target.value)}
                                        required
                                    />
                                    {errors.tgl_request && (
                                        <p className="text-sm text-red-600">{errors.tgl_request}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="no_imr">No. IMR</Label>
                                    <Input
                                        id="no_imr"
                                        value={nextNoImr}
                                        disabled
                                        className="bg-gray-100 font-mono"
                                    />
                                    <p className="text-xs text-gray-500">Nomor IMR akan di-generate otomatis</p>
                                </div>
                            </div>

                            {selectedKik && selectedKik.kartu_instruksi_kerja_boms && (
                                <div className="space-y-4">
                                    <div className="bg-gray-800 text-white p-3 rounded-t-md">
                                        <h3 className="text-center font-semibold">Kartu Instruksi Kerja Items</h3>
                                    </div>
                                    <div className="border rounded-b-md overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr className="border-b">
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode - Nama Item</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pesanan</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Approved</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Request</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Input</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedKik.kartu_instruksi_kerja_boms.map((item) => {
                                                    const itemRequest = itemRequests[item.id];
                                                    return (
                                                        <tr key={item.id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-4 text-sm text-gray-900">{item.bill_of_materials?.departemen?.nama_departemen}</td>
                                                            <td className="px-4 py-4 text-sm text-gray-900">
                                                                {item.bill_of_materials?.master_item?.kode_master_item} - {item.bill_of_materials?.master_item?.nama_master_item}
                                                            </td>
                                                            <td className="px-4 py-4 text-sm text-gray-900">-</td>
                                                            <td className="px-4 py-4 text-sm text-gray-900">{item.bill_of_materials?.master_item?.unit?.nama_satuan}</td>
                                                            <td className="px-4 py-4 text-sm text-gray-900">{item.total_kebutuhan}</td>
                                                            <td className="px-4 py-4 text-sm text-gray-900">0.00</td>
                                                            <td className="px-4 py-4 text-sm text-gray-900">0.00</td>
                                                            <td className="px-4 py-4 text-sm text-gray-900">
                                                                {itemRequest ? itemRequest.qty_request : 0}
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
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
                                    CANCEL
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {processing ? 'PROCESSING...' : 'PROCESS'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>No.SPK</Label>
                            <Input
                                value={selectedKik?.no_kartu_instruksi_kerja || ''}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Material Deskripsi</Label>
                            <Input
                                value={editingItem?.bill_of_materials?.master_item?.nama_master_item || ''}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Total Pesanan</Label>
                            <Input
                                value={editingItem?.total_kebutuhan || 0}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>


                        <div className="space-y-2">
                            <Label>Input Qty Request *</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editForm.qty_request}
                                onChange={(e) => setEditForm(prev => ({ ...prev, qty_request: parseFloat(e.target.value) || 0 }))}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            TUTUP
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSaveEdit}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            EDIT
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
