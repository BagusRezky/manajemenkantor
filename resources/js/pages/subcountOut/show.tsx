import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SubcountOut } from '@/types/subcountOut';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Building2, Calendar, FileText, Package, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subcount Out',
        href: '/subcountOuts',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

interface ShowProps {
    subcountOut: SubcountOut;
}

export default function Show({ subcountOut }: ShowProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return format(new Date(dateString), 'dd-MM-yyyy');
    };

    const subcountOutItems = subcountOut.subcount_out_items || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Subcount Out - ${subcountOut.no_subcount_out}`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-6 w-6" />
                                        Detail Subcont Out
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {/* Header Information */}
                                    <div className="rounded-lg border bg-gray-50 p-6 dark:bg-gray-800">
                                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                            Informasi
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {/* No Surat Jalan Subcont */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-600">No. Surat Jalan Subcont</Label>
                                                <Input value={subcountOut.no_subcount_out || ''} readOnly className="bg-white" />
                                            </div>

                                            {/* Tanggal */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-600">Tanggal Surat Jalan</Label>
                                                <Input value={formatDate(subcountOut.tgl_subcount_out)} readOnly className="bg-white" />
                                            </div>

                                            {/* Supplier */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-600">Supplier</Label>
                                                <div className="flex items-center gap-2 rounded-md border bg-white p-2">
                                                    <Building2 className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">{subcountOut.supplier?.nama_suplier || '-'}</span>
                                                </div>
                                            </div>

                                            {/* Admin Produksi */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-600">Admin Produksi</Label>
                                                <div className="flex items-center gap-2 rounded-md border bg-white p-2">
                                                    <User className="h-4 w-4 text-green-600" />
                                                    <span className="font-medium">{subcountOut.admin_produksi || '-'}</span>
                                                </div>
                                            </div>

                                            {/* Supervisor */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-600">Supervisor / Forman</Label>
                                                <div className="flex items-center gap-2 rounded-md border bg-white p-2">
                                                    <User className="h-4 w-4 text-orange-600" />
                                                    <span className="font-medium">{subcountOut.supervisor || '-'}</span>
                                                </div>
                                            </div>

                                            {/* Admin Mainstore */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-600">Admin Mainstore</Label>
                                                <div className="flex items-center gap-2 rounded-md border bg-white p-2">
                                                    <User className="h-4 w-4 text-purple-600" />
                                                    <span className="font-medium">{subcountOut.admin_mainstore || '-'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Keterangan */}
                                        {subcountOut.keterangan && (
                                            <div className="mt-6 space-y-2">
                                                <Label className="text-sm font-medium text-gray-600">Keterangan Surat Jalan</Label>
                                                <Textarea value={subcountOut.keterangan} readOnly className="bg-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Items Information */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                                <Package className="h-5 w-5 text-indigo-600" />
                                                Data Items Subcont Out
                                            </h3>
                                            <Badge variant="secondary" className="text-sm">
                                                Total: {subcountOutItems.length} item(s)
                                            </Badge>
                                        </div>

                                        {subcountOutItems.length > 0 ? (
                                            <div className="rounded-md border-2 dark:border-0 dark:bg-violet-600">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-gray-50 dark:bg-gray-800">
                                                            <TableHead className="font-semibold">No</TableHead>
                                                            <TableHead className="font-semibold">No. SPK</TableHead>
                                                            <TableHead className="font-semibold">Nama Produk</TableHead>
                                                            <TableHead className="text-right font-semibold">Qty</TableHead>
                                                            <TableHead className="font-semibold">Satuan</TableHead>
                                                            <TableHead className="font-semibold">Keterangan</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {subcountOutItems.map((item, index) => (
                                                            <TableRow key={item.id}>
                                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline" className="font-mono">
                                                                        {item.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="space-y-1">
                                                                        <div className="font-medium">
                                                                            {item.kartu_instruksi_kerja?.sales_order?.finish_good_item?.nama_barang ||
                                                                                '-'}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            {item.kartu_instruksi_kerja?.sales_order?.finish_good_item?.deskripsi ||
                                                                                ''}
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <span className="text-lg font-semibold text-blue-600">
                                                                        {item.qty.toLocaleString()}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="secondary">{item.unit?.nama_satuan || '-'}</Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className="text-sm">{item.keterangan || '-'}</span>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border-2 border-dashed bg-gray-50 p-12 text-center dark:bg-gray-800">
                                                <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                                <p className="text-lg font-medium text-gray-600">Tidak ada item</p>
                                                <p className="text-sm text-gray-500">Belum ada item yang ditambahkan ke surat jalan ini</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Metadata
                                    <div className="rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
                                        <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
                                            <div>
                                                <span className="font-medium">Dibuat pada:</span>{' '}
                                                {format(new Date(subcountOut.created_at), 'dd-MM-yyyy HH:mm:ss')}
                                            </div>
                                            <div>
                                                <span className="font-medium">Terakhir diupdate:</span>{' '}
                                                {format(new Date(subcountOut.updated_at), 'dd-MM-yyyy HH:mm:ss')}
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* Action Buttons */}
                                    <div className="flex justify-start space-x-2">
                                        <Link href={route('subcountOuts.index')}>
                                            <Button variant="outline">Kembali</Button>
                                        </Link>
                                        {/* <Link href={route('subcountOuts.edit', subcountOut.id)}>
                                            <Button variant="default">
                                                <FileText className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link> */}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
