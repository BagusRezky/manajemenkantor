/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ApprovalFormData, InternalMaterialRequest } from '@/types/internalMaterialRequest';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Internal Material Request', href: '/internalMaterialRequests' },
    { title: 'Approval', href: '#' },
];

interface Props {
    internalMaterialRequest: InternalMaterialRequest;
}

interface ApprovalItem {
    id: string;
    qty_approved: number;
}

export default function ApprovalInternalMaterialRequest({ internalMaterialRequest }: Props) {
    const [approvalItems, setApprovalItems] = useState<Record<string, ApprovalItem>>({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editForm, setEditForm] = useState({ qty_approved: 0 });

    const { data, setData, post, processing, errors } = useForm<ApprovalFormData>({
        items: [],
    });

    // Initialize approval data
    useEffect(() => {
        if (internalMaterialRequest.items) {
            const initialApprovals: Record<string, ApprovalItem> = {};
            internalMaterialRequest.items.forEach(item => {
                initialApprovals[item.id] = {
                    id: item.id,
                    qty_approved: item.qty_approved
                };
            });
            setApprovalItems(initialApprovals);
        }
    }, [internalMaterialRequest]);

    const handleEditApproval = (item: any) => {
        setEditingItem(item);
        const existingApproval = approvalItems[item.id] || { qty_approved: 0 };
        setEditForm({
            qty_approved: existingApproval.qty_approved
        });
        setIsEditModalOpen(true);
    };

    const handleSaveApproval = () => {
        if (editingItem && editForm.qty_approved >= 0) {
            setApprovalItems(prev => ({
                ...prev,
                [editingItem.id]: {
                    id: editingItem.id,
                    qty_approved: editForm.qty_approved
                }
            }));
            setIsEditModalOpen(false);
            setEditingItem(null);
        }
    };

    const handleSubmitApproval = (e: React.FormEvent) => {
        e.preventDefault();

        const approvalData = Object.values(approvalItems);

        setData('items', approvalData);

        post(`/internalMaterialRequests/${internalMaterialRequest.id}/approve`, {
            onSuccess: () => {
                toast.success('Internal Material Request berhasil diapprove');
            },
            onError: () => {
                toast.error('Gagal approve Internal Material Request');
            }
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Approval IMR - ${internalMaterialRequest.no_imr}`} />

            <div className="mx-5 py-5">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2"
                    >
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
                                <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                                    {internalMaterialRequest.no_imr}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">No. KIK</label>
                                    <p className="mt-1 text-sm text-gray-900">{internalMaterialRequest.kartu_instruksi_kerja?.no_kartu_instruksi_kerja}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Tgl Request</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(internalMaterialRequest.tgl_request)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <p className="mt-1 text-sm text-gray-900 uppercase">{internalMaterialRequest.status}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Sales Order</label>
                                    <p className="mt-1 text-sm text-gray-900">{internalMaterialRequest.kartu_instruksi_kerja?.sales_order?.no_bon_pesanan || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Production Plan</label>
                                    <p className="mt-1 text-sm text-gray-900">{internalMaterialRequest.kartu_instruksi_kerja?.production_plan || '-'}</p>
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
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material Item</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Kebutuhan</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Request</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Approved</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {internalMaterialRequest.items?.map((item, index) => {
                                            const approvalItem = approvalItems[item.id];
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
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
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.kartu_instruksi_kerja_bom?.total_kebutuhan || 0}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.qty_request}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {approvalItem ? approvalItem.qty_approved : item.qty_approved}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditApproval(item)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {(!internalMaterialRequest.items || internalMaterialRequest.items.length === 0) && (
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
                                    onClick={handleSubmitApproval}
                                    disabled={processing || internalMaterialRequest.status !== 'pending'}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {processing ? 'PROCESSING...' : 'APPROVE'}
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
                            <Input
                                value={editingItem?.kartu_instruksi_kerja_bom?.total_kebutuhan || 0}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Qty Request</Label>
                            <Input
                                value={editingItem?.qty_request || 0}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Qty Approved *</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max={editingItem?.qty_request || 0}
                                value={editForm.qty_approved}
                                onChange={(e) => setEditForm(prev => ({ ...prev, qty_approved: parseFloat(e.target.value) || 0 }))}
                                placeholder="0.00"
                            />
                            <p className="text-xs text-gray-500">
                                Maksimal: {editingItem?.qty_request || 0}
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            TUTUP
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSaveApproval}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            SIMPAN
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
