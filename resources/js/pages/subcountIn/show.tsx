import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SubcountIn } from '@/types/subcountIn';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subcount In',
        href: '/subcountIns',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

interface ShowProps {
    subcountIn: SubcountIn;
}

export default function Show({ subcountIn }: ShowProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const items = subcountIn.subcount_in_items || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Subcount In - ${subcountIn.no_subcount_in}`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Detail Subcount In </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Form Header */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="no_subcount_in">No. Subcount In</Label>
                                        <Input id="no_subcount_in" value={subcountIn.no_subcount_in || ''} readOnly />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_subcount_in">Tanggal Subcount In</Label>
                                        <Input id="tgl_subcount_in" value={formatDate(subcountIn.tgl_subcount_in)} readOnly />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="no_surat_jalan_pengiriman">No. Surat Jalan Pengiriman</Label>
                                        <Input id="no_surat_jalan_pengiriman" value={subcountIn.no_surat_jalan_pengiriman || ''} readOnly />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="admin_produksi">Admin Produksi</Label>
                                        <Input id="admin_produksi" value={subcountIn.admin_produksi || ''} readOnly />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="supervisor">Supervisor</Label>
                                        <Input id="supervisor" value={subcountIn.supervisor || ''} readOnly />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="admin_mainstore">Admin Mainstore</Label>
                                        <Input id="admin_mainstore" value={subcountIn.admin_mainstore || ''} readOnly />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="keterangan">Keterangan</Label>
                                    <Textarea id="keterangan" value={subcountIn.keterangan || ''} readOnly rows={3} />
                                </div>

                                {/* Items Table */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Detail Items</h3>
                                    {items.length > 0 ? (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>No. Subcount Out</TableHead>
                                                        <TableHead>No. SPK</TableHead>
                                                        <TableHead>Qty</TableHead>
                                                        <TableHead>Keterangan</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {items.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{item.subcount_out?.no_subcount_out || '-'}</TableCell>
                                                            <TableCell>
                                                                {item.subcount_out?.subcount_out_items
                                                                    ?.map((subItem) => subItem.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-')
                                                                    .join(', ') || '-'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="font-semibold text-blue-600">{item.qty.toLocaleString()}</span>
                                                            </TableCell>
                                                            <TableCell>{item.keterangan || '-'}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-gray-500">
                                            <p>Tidak ada item untuk Subcount In ini</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-start space-x-2">
                                    <Link href={route('subcountIns.index')}>
                                        <Button variant="outline">Kembali</Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
