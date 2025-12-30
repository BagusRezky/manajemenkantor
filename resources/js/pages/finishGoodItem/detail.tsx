import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { FinishGoodItem } from '@/types/finishGoodItem';
import { Head } from '@inertiajs/react';

interface DetailProps {
    finishGoodItem: FinishGoodItem;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finish Good Item',
        href: '/finishGoodItems',
    },
    {
        title: 'Detail',
        href: '/finishGoodItems/detail',
    },
];

export default function Detail({ finishGoodItem }: DetailProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail: ${finishGoodItem.nama_barang}`} />

            <div className="mx-5 space-y-6 py-5">
                {/* Informasi Umum */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Produk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">Kode Material Produk:</p>
                                <p>{finishGoodItem.kode_material_produk || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Spesifikasi Kertas:</p>
                                <p>{finishGoodItem.spesifikasi_kertas || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Nama Barang:</p>
                                <p>{finishGoodItem.nama_barang || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">UP 1:</p>
                                <p>{finishGoodItem.up_satu || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Customer:</p>
                                <p>{finishGoodItem.customer_address?.nama_customer || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tipe Item:</p>
                                <p>{finishGoodItem.type_item?.nama_type_item || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Unit:</p>
                                <p>{finishGoodItem.unit?.nama_satuan || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Ukuran Potong:</p>
                                <p>{finishGoodItem.ukuran_potong || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Ukuran Cetak:</p>
                                <p>{finishGoodItem.ukuran_cetak || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Berat Kotor:</p>
                                <p>{finishGoodItem.berat_kotor || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Berat Bersih:</p>
                                <p>{finishGoodItem.berat_bersih || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bill of Materials */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bill of Materials</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {Array.isArray(finishGoodItem.bill_of_materials) && finishGoodItem.bill_of_materials.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Departemen</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Waste</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {finishGoodItem.bill_of_materials.map((bom, index) => (
                                        <TableRow key={bom.id || index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{bom.departemen?.nama_departemen || '-'}</TableCell>
                                            <TableCell>{bom.master_item?.nama_master_item || '-'}</TableCell>
                                            <TableCell>{bom.qty}</TableCell>
                                            <TableCell>{bom.waste}</TableCell>
                                            <TableCell>{bom.keterangan || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p>Tidak ada bill of materials</p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button variant="secondary" onClick={() => window.history.back()}>
                        Kembali
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
