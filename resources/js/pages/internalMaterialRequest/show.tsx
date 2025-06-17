import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { InternalMaterialRequest } from '@/types/internalMaterialRequest';
import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Internal Material Request', href: '/internalMaterialRequests' },
    { title: 'Detail IMR', href: '#' },
];

interface Props {
    internalMaterialRequest: InternalMaterialRequest;
}

export default function ShowInternalMaterialRequest({ internalMaterialRequest }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail IMR - ${internalMaterialRequest.no_imr}`} />

            <div className="mx-5 py-5">
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">Detail Internal Material Request</h1>
                </div>

                <div className="space-y-6">
                    {/* Header Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Informasi IMR</span>
                                <div className="flex items-center gap-3">
                                    <Badge className={getStatusColor(internalMaterialRequest.status)}>
                                        {internalMaterialRequest.status.toUpperCase()}
                                    </Badge>
                                    <span className="rounded bg-gray-100 px-3 py-1 font-mono text-sm">{internalMaterialRequest.no_imr}</span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">No. IMR</label>
                                    <p className="mt-1 font-mono text-sm text-gray-900">{internalMaterialRequest.no_imr}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">No. Kartu Instruksi Kerja</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {internalMaterialRequest.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Tanggal Request</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(internalMaterialRequest.tgl_request)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <p className="mt-1">
                                        <Badge className={getStatusColor(internalMaterialRequest.status)}>
                                            {internalMaterialRequest.status.toUpperCase()}
                                        </Badge>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Sales Order</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {internalMaterialRequest.kartu_instruksi_kerja?.sales_order?.no_bon_pesanan || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Production Plan</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {internalMaterialRequest.kartu_instruksi_kerja?.production_plan || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Estimasi Selesai</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {internalMaterialRequest.kartu_instruksi_kerja?.tgl_estimasi_selesai
                                            ? new Date(internalMaterialRequest.kartu_instruksi_kerja.tgl_estimasi_selesai).toLocaleDateString('id-ID')
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Dibuat Pada</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(internalMaterialRequest.created_at)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Terakhir Update</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(internalMaterialRequest.updated_at)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>



                    {/* Material Items Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Material Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">No</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Kode Item
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Nama Material
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
                                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Status Item
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {internalMaterialRequest.items?.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{index + 1}</td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                                        {item.kartu_instruksi_kerja_bom?.bill_of_materials?.master_item?.kode_master_item || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900">
                                                    <div>
                                                        <div className="font-medium">
                                                            {item.kartu_instruksi_kerja_bom?.bill_of_materials?.master_item?.nama_master_item || '-'}
                                                        </div>
                                                        {/* <div className="text-xs text-gray-500">
                                                            BOM: {item.kartu_instruksi_kerja_bom?.bill_of_materials?.nama_bom || '-'}
                                                        </div> */}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    <span className="font-medium">
                                                        {Number(item.kartu_instruksi_kerja_bom?.total_kebutuhan || 0).toFixed(2)}
                                                    </span>
                                                    <div className="text-xs text-gray-500">KILOGRAM</div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    <span className="font-medium text-orange-600">{Number(item.qty_request || 0).toFixed(2)}</span>
                                                    <div className="text-xs text-gray-500">KILOGRAM</div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    <span className="font-medium text-green-600">{Number(item.qty_approved || 0).toFixed(2)}</span>
                                                    <div className="text-xs text-gray-500">KILOGRAM</div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    {item.qty_approved > 0 ? (
                                                        <Badge className="bg-green-100 text-green-800">APPROVED</Badge>
                                                    ) : item.qty_request > 0 ? (
                                                        <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-800">NO REQUEST</Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {(!internalMaterialRequest.items || internalMaterialRequest.items.length === 0) && (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                                    Tidak ada data item material.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    
                </div>
            </div>
        </AppLayout>
    );
}
