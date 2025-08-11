/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReturEksternal } from '@/types/externalReturn';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Retur Eksternal', href: '/returEksternals' },
    { title: 'Detail Retur Eksternal', href: '#' },
];

interface Props {
    returEksternal: ReturEksternal;
}

export default function ShowReturEksternal({ returEksternal }: Props) {
    const getSatuanName = (item: any) => {
        return (
            item.penerimaan_barang_item?.purchase_order_item?.master_konversi?.nama_satuan ||
            item.penerimaan_barang_item?.purchase_order_item?.satuan?.nama_satuan ||
            'PIECES'
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
            <Head title={`Detail Retur Eksternal - ${returEksternal.no_retur}`} />

            <div className="mx-5 py-5">
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">Detail Retur Eksternal</h1>
                </div>

                <div className="space-y-6">
                    {/* Header Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Retur Eksternal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">No. Retur</label>
                                    <p className="mt-1 text-sm text-gray-900">{returEksternal.no_retur}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">No. Laporan Penerimaan Barang</label>
                                    <p className="mt-1 text-sm text-gray-900">{returEksternal.penerimaan_barang?.no_laporan_barang}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Tgl Retur Barang</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(returEksternal.tgl_retur_barang)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nama Retur</label>
                                    <p className="mt-1 text-sm text-gray-900">{returEksternal.nama_retur}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Tgl Penerimaan Barang</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {returEksternal.penerimaan_barang?.tgl_terima_barang
                                            ? formatDate(returEksternal.penerimaan_barang.tgl_terima_barang)
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">No Surat Jalan Pengiriman</label>
                                    <p className="mt-1 text-sm text-gray-900">{returEksternal.penerimaan_barang?.no_surat_jalan || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Supplier</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {returEksternal.penerimaan_barang?.purchase_order?.supplier?.nama_suplier || '-'}
                                    </p>
                                </div>
                                <div className="md:col-span-2 lg:col-span-3">
                                    <label className="text-sm font-medium text-gray-500">Catatan Retur</label>
                                    <p className="mt-1 text-sm text-gray-900">{returEksternal.catatan_retur || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Item Penerimaan Barang</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">No</th>
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
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {returEksternal.items?.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{index + 1}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">
                                                    <div>
                                                        <div className="font-medium">
                                                            {item.penerimaan_barang_item?.purchase_order_item?.master_item?.kode_master_item}
                                                        </div>
                                                        <div className="text-gray-500">
                                                            {item.penerimaan_barang_item?.purchase_order_item?.master_item?.nama_master_item}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    {item.penerimaan_barang_item?.qty_penerimaan} | {getSatuanName(item)}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900">
                                                    {item.penerimaan_barang_item?.catatan_item || '-'}
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    {item.qty_retur} | {getSatuanName(item)}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{item.catatan_retur_item || '-'}</td>
                                            </tr>
                                        ))}
                                        {(!returEksternal.items || returEksternal.items.length === 0) && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                                    Tidak ada data item retur.
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
