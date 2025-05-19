/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { formatRupiah } from "@/utils/formatter/currency";
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
    purchaseOrder: PurchaseOrder;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase Orders',
        href: '/purchaseOrders',

    },
    {
        title: 'Detail Purchase Order',
        href: '#',
    },
];

export default function Show({ purchaseOrder }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Purchase Order" />
            <div className="mx-5 py-5">
                <Card className="mb-6">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle>Detail Purchase Order</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">No. Purchase Order</h3>
                                    <p className="text-base">{purchaseOrder.no_po}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">No. Purchase Request</h3>
                                    <p className="text-base">{purchaseOrder.purchase_request?.no_pr}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                                    <p className="text-base">{purchaseOrder.supplier?.nama_suplier || '-'}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">PO Date</h3>
                                    <p className="text-base">{format(new Date(purchaseOrder.tanggal_po), 'dd/MM/yyyy')}</p>
                                </div>
                            </div>
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Eta</h3>
                                    <p className="text-base">{format(new Date(purchaseOrder.eta), 'dd/MM/yyyy')}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Mata Uang</h3>
                                    <p className="text-base">{purchaseOrder.mata_uang}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">PPN</h3>
                                    <p className="text-base">{purchaseOrder.ppn}</p>
                                </div>
                            </div>
                        </div>
                        {/* <div className="mt-4 grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Nama Pengirim</h3>
                                <p className="text-base">{penerimaanBarang.nama_pengirim}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Catatan Pengirim</h3>
                                <p className="text-base">{penerimaanBarang.catatan_pengirim || '-'}</p>
                            </div>
                        </div> */}
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

                                    <TableHead>Satuan PO</TableHead>
                                    <TableHead>Harga Satuan</TableHead>
                                    <TableHead>Diskon</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Catatan Item PO</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchaseOrder.items?.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {item.master_item?.kode_master_item} - {item.master_item?.nama_master_item}
                                        </TableCell>
                                        <TableCell>{item.qty_po}</TableCell>

                                        <TableCell>{getSatuanName(item)}</TableCell>
                                        <TableCell>{formatRupiah(item.harga_satuan || 0)}</TableCell>
                                        <TableCell>{item.diskon_satuan || '0'}%</TableCell>
                                        <TableCell>{formatRupiah(item.jumlah || 0)}</TableCell>
                                        <TableCell>{item.remark_item_po || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="mt-4">
                    <Link href={route('purchaseOrders.index')}>
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
