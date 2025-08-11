/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ApprovalFormData, ImrFinishing } from '@/types/imrFinishing';

import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Internal Material Request', href: '/imrFinishings' },
    { title: 'Approval', href: '#' },
];

interface Props {
    imrFinishing: ImrFinishing;
}

interface ApprovalItem {
    id: string;
    qty_approved: number;
}

export default function ApprovalInternalMaterialRequest({ imrFinishing }: Props) {
    const [approvalItems, setApprovalItems] = useState<Record<string, ApprovalItem>>({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editForm, setEditForm] = useState({ qty_approved: 0 });

    const { data, setData, post, processing, errors } = useForm<ApprovalFormData>({
        items: [],
    });

    // Initialize approval data
    useEffect(() => {
        if (imrFinishing.items) {
            const initialApprovals: Record<string, ApprovalItem> = {};
            const initialFormData: any[] = [];

            imrFinishing.items.forEach((item) => {
                const approvalItem = {
                    id: item.id,
                    qty_approved: item.qty_approved || 0,
                };

                initialApprovals[item.id] = approvalItem;
                initialFormData.push(approvalItem);
            });

            setApprovalItems(initialApprovals);
            // Set initial form data immediately
            setData('items', initialFormData);
        }
    }, [imrFinishing]);

    // Update form data whenever approvalItems changes
    useEffect(() => {
        const formItems = Object.values(approvalItems);
        setData('items', formItems);
    }, [approvalItems]);

    const handleEditApproval = (item: any) => {
        setEditingItem(item);
        const existingApproval = approvalItems[item.id] || { qty_approved: 0 };
        setEditForm({
            qty_approved: existingApproval.qty_approved,
        });
        setIsEditModalOpen(true);
    };

    const handleSaveApproval = () => {
        if (editingItem && editForm.qty_approved >= 0) {
            setApprovalItems((prev) => ({
                ...prev,
                [editingItem.id]: {
                    id: editingItem.id,
                    qty_approved: editForm.qty_approved,
                },
            }));
            setIsEditModalOpen(false);
            setEditingItem(null);
        }
    };

    const handleSubmitApproval = async (e: React.FormEvent) => {
        e.preventDefault();

        // Pastikan data terbaru tersimpan dalam form
        const latestApprovalData = Object.values(approvalItems);

        // Set data secara eksplisit sebelum submit
        setData('items', latestApprovalData);

        // Tunggu sebentar untuk memastikan state ter-update
        setTimeout(() => {
            post(`/imrFinishings/${imrFinishing.id}/approve`, {
                onSuccess: () => {
                    toast.success('Internal Material Request berhasil diapprove');
                },
                onError: (errors) => {
                    console.error('Approval errors:', errors);
                    toast.error('Gagal approve Internal Material Request');
                },
            });
        }, 100);
    };

    // Alternative submit method yang lebih reliable
    const handleSubmitApprovalAlternative = async () => {
        const approvalData = Object.values(approvalItems);

        // Validasi data sebelum submit
        if (approvalData.length === 0) {
            toast.error('Tidak ada data approval untuk disubmit');
            return;
        }

        // Set data form dengan approval data terbaru
        setData('items', approvalData);

        // Submit setelah data di-set
        setTimeout(() => {
            post(`/imrFinishings/${imrFinishing.id}/approve`, {
                onSuccess: () => {
                    toast.success('Internal Material Request berhasil diapprove');
                },
                onError: (errors) => {
                    console.error('Approval errors:', errors);
                    toast.error('Gagal approve Internal Material Request');
                },
                onBefore: () => {
                    console.log('Submitting approval data:', approvalData);
                },
            });
        }, 100);
    };

    // Method alternatif menggunakan router langsung jika useForm masih bermasalah
    const handleDirectSubmit = () => {
        const approvalData = Object.values(approvalItems);

        // Validasi data sebelum submit
        if (approvalData.length === 0) {
            toast.error('Tidak ada data approval untuk disubmit');
            return;
        }

        // Convert to plain objects format compatible with FormDataConvertible
        const formattedData = approvalData.map((item) => ({
            id: item.id,
            qty_approved: item.qty_approved,
        }));

        // Submit langsung menggunakan router tanpa useForm
        router.post(
            `/imrFinishings/${imrFinishing.id}/approve`,
            {
                items: formattedData,
            },
            {
                onSuccess: () => {
                    toast.success('Internal Material Request berhasil diapprove');
                },
                onError: (errors) => {
                    console.error('Approval errors:', errors);
                    toast.error('Gagal approve Internal Material Request');
                },
                onBefore: () => {
                    console.log('Submitting approval data via router:', approvalData);
                },
            },
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Approval IMR - ${imrFinishing.no_imr_finishing}`} />

            <div className="mx-5 py-5">
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">Approval Internal Material Request</h1>
                </div>

                <div className="space-y-6">
                    {/* Header Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Informasi IMR</span>
                                <span className="rounded bg-gray-100 px-3 py-1 font-mono text-sm">{imrFinishing.no_imr_finishing}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">No. SPK</label>
                                    <p className="mt-1 text-sm text-gray-900">{imrFinishing.kartu_instruksi_kerja?.no_kartu_instruksi_kerja}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Tgl Request</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(imrFinishing.tgl_request)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <p className="mt-1 text-sm text-gray-900 uppercase">{imrFinishing.status}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Sales Order</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {imrFinishing.kartu_instruksi_kerja?.sales_order?.no_bon_pesanan || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Production Plan</label>
                                    <p className="mt-1 text-sm text-gray-900">{imrFinishing.kartu_instruksi_kerja?.production_plan || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items Approval Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Material Items - Approval</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">No</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Material Item
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Total Kebutuhan
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Qty Request
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Qty Approved
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {imrFinishing.items?.map((item, index) => {
                                            const approvalItem = approvalItems[item.id];
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{index + 1}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        <div>
                                                            <div className="font-medium">
                                                                {item.kartu_instruksi_kerja_bom?.bill_of_materials?.master_item?.kode_master_item}
                                                            </div>
                                                            <div className="text-gray-500">
                                                                {item.kartu_instruksi_kerja_bom?.bill_of_materials?.master_item?.nama_master_item}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                        {item.kartu_instruksi_kerja_bom?.total_kebutuhan || 0}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{item.qty_request}</td>
                                                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                        <span className="font-semibold text-blue-600">
                                                            {approvalItem ? approvalItem.qty_approved : item.qty_approved}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                        <Button type="button" variant="outline" size="sm" onClick={() => handleEditApproval(item)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {(!imrFinishing.items || imrFinishing.items.length === 0) && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                                    Tidak ada data item material.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    BATAL
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleDirectSubmit}
                                    disabled={processing || imrFinishing.status !== 'pending'}
                                    className="bg-blue-600 hover:bg-blue-700"
                                    variant="outline"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    APPROVE
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Approval Quantity</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Material Item</Label>
                            <Input
                                value={editingItem?.kartu_instruksi_kerja_bom?.bill_of_materials?.master_item?.nama_master_item || ''}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Total Kebutuhan</Label>
                            <Input value={editingItem?.kartu_instruksi_kerja_bom?.total_kebutuhan || 0} disabled className="bg-gray-100" />
                        </div>

                        <div className="space-y-2">
                            <Label>Qty Request</Label>
                            <Input value={editingItem?.qty_request || 0} disabled className="bg-gray-100" />
                        </div>

                        <div className="space-y-2">
                            <Label>Qty Approved *</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max={editingItem?.qty_request || 0}
                                value={editForm.qty_approved}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, qty_approved: parseFloat(e.target.value) || 0 }))}
                                placeholder="0.00"
                            />
                            <p className="text-xs text-gray-500">Maksimal: {editingItem?.qty_request || 0}</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            TUTUP
                        </Button>
                        <Button type="button" onClick={handleSaveApproval} className="bg-blue-600 hover:bg-blue-700">
                            SIMPAN
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
