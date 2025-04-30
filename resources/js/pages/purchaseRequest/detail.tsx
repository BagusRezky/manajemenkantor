import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { PurchaseRequest } from '@/types/purchaseRequest';
import { Head } from '@inertiajs/react';


interface DetailProps {
    purchaseRequest: PurchaseRequest;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase Request',
        href: '/purchaseRequest',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

export default function Detail({ purchaseRequest }: DetailProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail PR: ${purchaseRequest.no_pr}`} />

            <div className="mx-5 space-y-6 py-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Purchase Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">No. PR:</p>
                                <p>{purchaseRequest.no_pr}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tanggal PR:</p>
                                <p>
                                    {new Date(purchaseRequest.tgl_pr).toLocaleDateString() ||
                                purchaseRequest.tgl_pr || '-'
                                }</p>
                            </div>
                            <div>
                                <p className="font-semibold">Departemen:</p>
                                <p>{purchaseRequest.departemen?.nama_departemen || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Status:</p>
                                <p>{purchaseRequest.status || '-'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Total Item:</p>
                                <p>{Array.isArray(purchaseRequest.purchase_request_items) ? purchaseRequest.purchase_request_items.length : 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Item</CardTitle>
                    </CardHeader>
                    <CardContent>

                        {Array.isArray(purchaseRequest.purchase_request_items) && purchaseRequest.purchase_request_items.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Kode Item</TableHead>
                                        <TableHead>Nama Item</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead>ETA</TableHead>
                                        <TableHead>Catatan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {purchaseRequest.purchase_request_items.map((prItem, index) => (
                                        <TableRow key={prItem.id || index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{prItem.master_item?.kode_master_item || '-'}</TableCell>
                                            <TableCell>{prItem.master_item?.nama_master_item || '-'}</TableCell>
                                            <TableCell>{prItem.qty}</TableCell>
                                            <TableCell>{prItem.master_item?.unit?.nama_satuan || '-'}</TableCell>
                                            <TableCell>
                                                {prItem.eta ? new Date(prItem.eta).toLocaleDateString() :
                                            prItem.eta || '-'
                                                }</TableCell>
                                            <TableCell>{prItem.catatan || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p>Tidak ada item</p>
                        )}
                    </CardContent>
                </Card>

                {/* References for each item */}
                {Array.isArray(purchaseRequest.purchase_request_items) &&
                    purchaseRequest.purchase_request_items.map((prItem, itemIndex) => {
                        // Check if item_references exists and is an array with elements
                        if (!Array.isArray(prItem.item_references) || prItem.item_references.length === 0) {
                            return null;
                        }

                        return (
                            <Card key={`ref-${prItem.id || itemIndex}`}>
                                <CardHeader>
                                    <CardTitle>
                                        Referensi untuk Item {itemIndex + 1}: {prItem.master_item?.nama_master_item|| '-'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>No</TableHead>
                                                <TableHead>Tipe</TableHead>
                                                <TableHead>Referensi</TableHead>
                                                <TableHead>Qty</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {prItem.item_references.map((ref, refIndex) => (
                                                <TableRow key={ref.id || refIndex}>
                                                    <TableCell>{refIndex + 1}</TableCell>
                                                    <TableCell>{ref.type === 'department' ? 'Departemen' : 'Customer'}</TableCell>
                                                    <TableCell>
                                                        {ref.type === 'department' ? (
                                                            ref.departemen?.nama_departemen || '-'
                                                        ) : (
                                                            <>
                                                                {ref.customerAddress?.nama_customer || '-'}
                                                                {ref.kartuInstruksiKerja?.no_kartu_instruksi_kerja
                                                                    ? ` - ${ref.kartuInstruksiKerja.no_kartu_instruksi_kerja}`
                                                                    : ''}
                                                            </>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{ref.qty}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        );
                    })}

                <div className="flex justify-end">
                    <Button variant="secondary" onClick={() => window.history.back()}>
                        Kembali
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
