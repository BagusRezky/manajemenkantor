/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { PenerimaanBarang } from "@/types/penerimaanBarang";
import { Head, Link } from "@inertiajs/react";
import { format } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";

// Helper function untuk mendapatkan nama satuan
const getSatuanName = (item: any) => {
    return item.master_konversi?.nama_satuan ||
           item.satuan?.nama_satuan ||
           item.id_satuan_po ||
           'Satuan tidak tersedia';
};

interface ShowProps {
    penerimaanBarang: PenerimaanBarang;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penerimaan Barang',
        href: '/penerimaanBarangs',
    },
    {
        title: 'Detail Penerimaan Barang',
        href: '#',
    },
];

export default function Show({ penerimaanBarang }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Penerimaan Barang" />
            <div className="mx-5 py-5">
                <Card className="mb-6">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle>Detail Penerimaan Barang</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">No. Laporan Barang</h3>
                                    <p className="text-base">{penerimaanBarang.no_laporan_barang}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">No. Purchase Order</h3>
                                    <p className="text-base">{penerimaanBarang.purchase_order?.no_po}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                                    <p className="text-base">{penerimaanBarang.purchase_order?.supplier?.nama_suplier || '-'}</p>
                                </div>
                            </div>
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">No. Surat Jalan</h3>
                                    <p className="text-base">{penerimaanBarang.no_surat_jalan}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Tanggal Terima</h3>
                                    <p className="text-base">{format(new Date(penerimaanBarang.tgl_terima_barang), 'dd/MM/yyyy')}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Nopol Kendaraan</h3>
                                    <p className="text-base">{penerimaanBarang.nopol_kendaraan}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Nama Pengirim</h3>
                                <p className="text-base">{penerimaanBarang.nama_pengirim}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Catatan Pengirim</h3>
                                <p className="text-base">{penerimaanBarang.catatan_pengirim || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Item Penerimaan Barang</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Kode - Nama Item</TableHead>
                                    <TableHead>Qty PO</TableHead>
                                    <TableHead>Qty Penerimaan</TableHead>
                                    <TableHead>Satuan</TableHead>
                                    <TableHead>Catatan Item</TableHead>
                                    <TableHead>Tgl.Exp | No.Delivery Order</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {penerimaanBarang.items?.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {item.purchase_order_item?.master_item?.kode_master_item} - {item.purchase_order_item?.master_item?.nama_master_item}
                                        </TableCell>
                                        <TableCell>{item.purchase_order_item?.qty_po}</TableCell>
                                        <TableCell>{item.qty_penerimaan}</TableCell>
                                        <TableCell>{getSatuanName(item.purchase_order_item)}</TableCell>
                                        <TableCell>{item.catatan_item || '-'}</TableCell>
                                        <TableCell>
                                            {item.tgl_expired
                                                ? `${format(new Date(item.tgl_expired), 'dd/MM/yyyy')} | ${item.no_delivery_order || '-'}`
                                                : '- | -'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="mt-4">
                    <Link href={route('penerimaanBarangs.index')}>
                        <Button variant="outline">
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
