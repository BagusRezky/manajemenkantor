import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SalesOrder } from '@/types/salesOrder';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface ShowProps {
    salesOrder: SalesOrder;
}

export default function Show({ salesOrder }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Sales Order', href: '/salesOrders' },
        { title: 'Detail', href: `/salesOrders/${salesOrder.id}` },
    ];

    // Helper untuk menampilkan label field
    const DetailItem = ({ label, value }: { label: string; value: string | number | undefined | null }) => (
        <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">{label}</p>
            <p className="text-sm font-semibold">{value || '-'}</p>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Sales Order - ${salesOrder.no_bon_pesanan}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Header Actions */}
                    <div className="flex items-center justify-between">
                        <Link href={route('salesOrders.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle className="text-lg">Informasi Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                                    <DetailItem label="No. Sales Order" value={salesOrder.no_bon_pesanan} />
                                </div>
                                <DetailItem label="Customer" value={salesOrder.customer_address?.nama_customer} />
                                <DetailItem label="No. PO Customer" value={salesOrder.no_po_customer} />
                                <DetailItem label="Tanggal PO" value={salesOrder.eta_marketing} />
                                <DetailItem label="Dipesan Via" value={salesOrder.dipesan_via} />
                                <DetailItem label="Tipe Pesanan" value={salesOrder.tipe_pesanan} />
                            </CardContent>
                        </Card>

                        {/* Kolom Kanan: Detail Teknis & Harga */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-lg">Detail Produk & Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <DetailItem
                                            label="Nama Produk"
                                            value={salesOrder.finish_good_item?.nama_barang || salesOrder.master_item?.nama_master_item}
                                        />
                                        <DetailItem label="Jumlah Pesanan" value={salesOrder.jumlah_pesanan} />
                                        <DetailItem label="Toleransi Pengiriman" value={`${salesOrder.toleransi_pengiriman}%`} />
                                        <DetailItem label="Klaim Kertas" value={salesOrder.klaim_kertas} />
                                    </div>
                                    <div className="space-y-4">
                                        <DetailItem label="Mata Uang" value={salesOrder.mata_uang} />
                                        <DetailItem label="Harga PCS (SO)" value={salesOrder.harga_pcs_bp} />
                                        <DetailItem label="Harga PCS (Kirim)" value={salesOrder.harga_pcs_kirim} />
                                        <DetailItem label="Syarat Pembayaran" value={salesOrder.syarat_pembayaran} />
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <DetailItem label="Catatan Colour Range" value={salesOrder.catatan_colour_range} />
                                    <DetailItem label="Catatan Umum" value={salesOrder.catatan} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bill of Materials Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold">Bill of Materials (BOM)</CardTitle>
                            <Badge variant="secondary">{salesOrder.finish_good_item?.bill_of_materials?.length || 0} Items</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[50px] text-center">No</TableHead>
                                            <TableHead>Material</TableHead>
                                            <TableHead>Departemen</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead>Satuan</TableHead>
                                            <TableHead className="text-center">Waste</TableHead>
                                            <TableHead>Keterangan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {salesOrder.finish_good_item?.bill_of_materials &&
                                        salesOrder.finish_good_item.bill_of_materials.length > 0 ? (
                                            salesOrder.finish_good_item.bill_of_materials.map((bom, index) => (
                                                <TableRow key={bom.id}>
                                                    <TableCell className="text-center">{index + 1}</TableCell>
                                                    <TableCell className="font-medium">{bom.master_item?.nama_master_item || '-'}</TableCell>
                                                    <TableCell>{bom.departemen?.nama_departemen || '-'}</TableCell>
                                                    <TableCell className="text-center">{bom.qty}</TableCell>
                                                    <TableCell>{bom.master_item?.unit?.nama_satuan || '-'}</TableCell>
                                                    <TableCell className="text-center ">{bom.waste}</TableCell>
                                                    <TableCell className="text-muted-foreground">{bom.keterangan || '-'}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-muted-foreground h-24 text-center">
                                                    Tidak ada data Bill of Materials untuk produk ini.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
