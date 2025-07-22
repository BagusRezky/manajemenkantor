/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { formatToInteger } from '@/utils/formatter/decimaltoint';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Factory, Package, Printer, Search, Sparkles, Truck, Wrench, XCircle } from 'lucide-react';
import { useState } from 'react';

// Production Detail Modal Component
interface ProductionDetailModalProps {
    printings: any[];
    dieMakings: any[];
    finishings: any[];
}

function ProductionDetailModal({ printings, dieMakings, finishings }: ProductionDetailModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Search className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px] xl:max-w-[1400px]">
                <DialogHeader>
                    <DialogTitle>Detail Data Produksi</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Printing Details */}
                    <div>
                        <h4 className="mb-3 flex items-center gap-2 font-medium">
                            <Printer className="h-4 w-4 text-blue-600" />
                            Detail Printing
                        </h4>
                        {printings.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tgl.Entri / User Input</TableHead>
                                        <TableHead>Proses</TableHead>
                                        <TableHead>Mesin</TableHead>
                                        <TableHead>Operator</TableHead>
                                        <TableHead>Jumlah Baik</TableHead>
                                        <TableHead>Jumlah Rusak</TableHead>
                                        <TableHead>Semi Waste</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {printings.map((printing, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{format(new Date(printing.tanggal_entri), 'dd-MM-yyyy')}</div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="secondary">{printing.proses_printing}</Badge>
                                            </TableCell>
                                            <TableCell>{printing.mesin?.nama_mesin || '-'}</TableCell>
                                            <TableCell>{printing.operator?.nama_operator || '-'}</TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-green-600">{printing.hasil_baik_printing.toLocaleString()}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-red-600">{printing.hasil_rusak_printing.toLocaleString()}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-yellow-600">{printing.semi_waste_printing.toLocaleString()}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={printing.keterangan_printing === 'Reguler' ? 'default' : 'destructive'}>
                                                    {printing.keterangan_printing}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                <Printer className="mx-auto mb-3 h-12 w-12 opacity-50" />
                                <p>Belum ada data printing untuk SPK ini</p>
                            </div>
                        )}
                    </div>

                    {/* Die Making Details */}
                    <div>
                        <h4 className="mb-3 flex items-center gap-2 font-medium">
                            <Wrench className="h-4 w-4 text-purple-600" />
                            Detail Die Making
                        </h4>
                        {dieMakings.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tgl.Entri / User Input</TableHead>
                                        <TableHead>Proses</TableHead>
                                        <TableHead>Mesin</TableHead>
                                        <TableHead>Operator</TableHead>
                                        <TableHead>Jumlah Baik</TableHead>
                                        <TableHead>Jumlah Rusak</TableHead>
                                        <TableHead>Semi Waste</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dieMakings.map((diemaking, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{format(new Date(diemaking.tanggal_entri), 'dd-MM-yyyy')}</div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="secondary">{diemaking.proses_diemaking}</Badge>
                                            </TableCell>
                                            <TableCell>{diemaking.mesin_diemaking?.nama_mesin_diemaking || '-'}</TableCell>
                                            <TableCell>{diemaking.operator_diemaking?.nama_operator_diemaking || '-'}</TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-green-600">
                                                    {diemaking.hasil_baik_diemaking.toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-red-600">{diemaking.hasil_rusak_diemaking.toLocaleString()}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-yellow-600">
                                                    {diemaking.semi_waste_diemaking.toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={diemaking.keterangan_diemaking === 'Reguler' ? 'default' : 'destructive'}>
                                                    {diemaking.keterangan_diemaking}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                <Wrench className="mx-auto mb-3 h-12 w-12 opacity-50" />
                                <p>Belum ada data die making untuk SPK ini</p>
                            </div>
                        )}
                    </div>

                    {/* Finishing Details */}
                    <div>
                        <h4 className="mb-3 flex items-center gap-2 font-medium">
                            <Sparkles className="h-4 w-4 text-orange-600" />
                            Detail Finishing
                        </h4>
                        {finishings.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tgl.Entri / User Input</TableHead>

                                        <TableHead>Proses</TableHead>
                                        <TableHead>Mesin</TableHead>
                                        <TableHead>Operator</TableHead>
                                        <TableHead>Jumlah Baik</TableHead>
                                        <TableHead>Jumlah Rusak</TableHead>
                                        <TableHead>Semi Waste</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {finishings.map((finishing, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{format(new Date(finishing.tanggal_entri), 'dd-MM-yyyy')}</div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="secondary">{finishing.proses_finishing}</Badge>
                                            </TableCell>
                                            <TableCell>{finishing.mesin_finishing?.nama_mesin_finishing || '-'}</TableCell>
                                            <TableCell>{finishing.operator_finishing?.nama_operator_finishing || '-'}</TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-green-600">
                                                    {finishing.hasil_baik_finishing.toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-red-600">{finishing.hasil_rusak_finishing.toLocaleString()}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-yellow-600">
                                                    {finishing.semi_waste_finishing.toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={finishing.keterangan_finishing === 'Reguler' ? 'default' : 'destructive'}>
                                                    {finishing.keterangan_finishing}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                <Sparkles className="mx-auto mb-3 h-12 w-12 opacity-50" />
                                <p>Belum ada data finishing untuk SPK ini</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Surat Perintah Kerja',
        href: '/kartuInstruksiKerja',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

interface ShowProps {
    kartuInstruksiKerja: KartuInstruksiKerja;
}

export default function Show({ kartuInstruksiKerja }: ShowProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const salesOrder = kartuInstruksiKerja.sales_order;
    const finishGoodItem = salesOrder?.finish_good_item;
    const bomItems = kartuInstruksiKerja.kartu_instruksi_kerja_boms || [];
    const printings = kartuInstruksiKerja.printings || [];
    const dieMakings = kartuInstruksiKerja.die_makings || [];
    const finishings = kartuInstruksiKerja.finishings || [];
    const packagings = kartuInstruksiKerja.packagings || [];
    const suratJalans = kartuInstruksiKerja.surat_jalans || [];

    const totalStokBarangJadi = packagings.reduce((total, packaging) => {
        const totalPenuh = packaging.jumlah_satuan_penuh * packaging.qty_persatuan_penuh;
        const totalSisa = packaging.jumlah_satuan_sisa * packaging.qty_persatuan_sisa;
        return total + totalPenuh + totalSisa;
    }, 0);

    const totalPengiriman = suratJalans.reduce((total, suratJalan) => {
        return total + (suratJalan.qty_pengiriman || 0);
    }, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail SPK - ${kartuInstruksiKerja.no_kartu_instruksi_kerja}`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Detail Surat Perintah Kerja</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        {/* No Surat Perintah Kerja */}
                                        <div className="space-y-2">
                                            <Label htmlFor="no_kartu_instruksi_kerja">No. Surat Perintah Kerja</Label>
                                            <Input
                                                id="no_kartu_instruksi_kerja"
                                                value={kartuInstruksiKerja.no_kartu_instruksi_kerja || ''}
                                                readOnly
                                            />
                                        </div>

                                        {/* Sales Order */}
                                        <div className="space-y-2">
                                            <Label htmlFor="id_sales_order">No. Sales Order</Label>
                                            <Input id="id_sales_order" value={salesOrder?.no_bon_pesanan || ''} readOnly />
                                        </div>

                                        {/* Production Plan */}
                                        <div className="space-y-2">
                                            <Label htmlFor="production_plan">Production Plan</Label>
                                            <Input id="production_plan" value={kartuInstruksiKerja.production_plan || ''} readOnly />
                                        </div>

                                        {/* Tanggal Estimasi Selesai */}
                                        <div className="space-y-2">
                                            <Label htmlFor="tgl_estimasi_selesai">Tanggal Estimasi Selesai</Label>
                                            <Input id="tgl_estimasi_selesai" value={formatDate(kartuInstruksiKerja.tgl_estimasi_selesai)} readOnly />
                                        </div>

                                        {/* ETA Marketing */}
                                        <div className="space-y-2">
                                            <Label htmlFor="eta_marketing">ETA Marketing</Label>
                                            <Input value={formatDate(salesOrder?.eta_marketing || '')} readOnly />
                                        </div>
                                    </div>

                                    {/* Detail Sales Order */}
                                    {salesOrder && (
                                        <div className="rounded-md border p-4">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                {/* Up Satu */}
                                                <div className="space-y-2">
                                                    <Label>Up Satu</Label>
                                                    <Input value={finishGoodItem?.up_satu || ''} readOnly />
                                                </div>

                                                {/* Up Dua */}
                                                <div className="space-y-2">
                                                    <Label>Up Dua</Label>
                                                    <Input value={finishGoodItem?.up_dua || ''} readOnly />
                                                </div>

                                                {/* Up Tiga */}
                                                <div className="space-y-2">
                                                    <Label>Up Tiga</Label>
                                                    <Input value={finishGoodItem?.up_tiga || ''} readOnly />
                                                </div>

                                                {/* Ukuran Potong */}
                                                <div className="space-y-2">
                                                    <Label>Ukuran Potong</Label>
                                                    <Input value={finishGoodItem?.ukuran_potong || ''} readOnly />
                                                </div>

                                                {/* Ukuran Cetak */}
                                                <div className="space-y-2">
                                                    <Label>Ukuran Cetak</Label>
                                                    <Input value={finishGoodItem?.ukuran_cetak || ''} readOnly />
                                                </div>

                                                {/* Spesifikasi Kertas */}
                                                <div className="space-y-2">
                                                    <Label>Spesifikasi Kertas</Label>
                                                    <Input value={finishGoodItem?.spesifikasi_kertas || ''} readOnly />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Detail Sales Order Information */}
                                    {salesOrder && (
                                        <div className="mb-6 rounded-md border p-4">
                                            <h3 className="mb-4 text-lg font-medium">Detail Sales Order</h3>

                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <dl className="space-y-3">
                                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                                        <dt className="font-medium text-gray-700 sm:w-1/2 sm:flex-shrink-0">No Sales Order:</dt>
                                                        <dd className="mt-1 text-gray-900 sm:mt-0 sm:ml-4">{salesOrder.no_bon_pesanan}</dd>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                                        <dt className="font-medium text-gray-700 sm:w-1/2 sm:flex-shrink-0">No PO Customer:</dt>
                                                        <dd className="mt-1 text-gray-900 sm:mt-0 sm:ml-4">{salesOrder.no_po_customer}</dd>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                                        <dt className="font-medium text-gray-700 sm:w-1/2 sm:flex-shrink-0">Customer:</dt>
                                                        <dd className="mt-1 text-gray-900 sm:mt-0 sm:ml-4">
                                                            {salesOrder.customer_address?.nama_customer}
                                                        </dd>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-start">
                                                        <dt className="font-medium text-gray-700 sm:w-1/2 sm:flex-shrink-0">Nama Barang:</dt>
                                                        <dd className="mt-1 text-gray-900 sm:mt-0 sm:ml-4">{finishGoodItem?.nama_barang}</dd>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-start">
                                                        <dt className="font-medium text-gray-700 sm:w-1/2 sm:flex-shrink-0">Deskripsi:</dt>
                                                        <dd className="mt-1 text-gray-900 sm:mt-0 sm:ml-4">{finishGoodItem?.deskripsi}</dd>
                                                    </div>
                                                </dl>

                                                <dl className="space-y-3">
                                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                                        <dt className="font-medium text-gray-700 sm:w-1/2 sm:flex-shrink-0">Jumlah Pesanan:</dt>
                                                        <dd className="mt-1 text-gray-900 sm:mt-0 sm:ml-4">{salesOrder.jumlah_pesanan}</dd>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                                        <dt className="font-medium text-gray-700 sm:w-1/2 sm:flex-shrink-0">Toleransi:</dt>
                                                        <dd className="mt-1 text-gray-900 sm:mt-0 sm:ml-4">{salesOrder.toleransi_pengiriman}%</dd>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                                        <dt className="font-medium text-gray-700 sm:w-1/2 sm:flex-shrink-0">Tipe Pesanan:</dt>
                                                        <dd className="mt-1 text-gray-900 sm:mt-0 sm:ml-4">{salesOrder.tipe_pesanan}</dd>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                                        <dt className="font-medium text-gray-700 sm:w-1/2 sm:flex-shrink-0">Tanggal Pesanan:</dt>
                                                        <dd className="mt-1 text-gray-900 sm:mt-0 sm:ml-4">{salesOrder.eta_marketing}</dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>
                                    )}

                                    {/* Detail Perhitungan Sheet */}
                                    {bomItems.some((item) => item.bill_of_materials?.master_item?.unit?.nama_satuan === 'SHEET') && (
                                        <div className="rounded-md border p-4">
                                            <h3 className="mb-4 text-lg font-medium">Detail Perhitungan Sheet</h3>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {bomItems
                                                    .filter((item) => item.bill_of_materials?.master_item?.unit?.nama_satuan === 'SHEET')
                                                    .map((sheetItem, index) => (
                                                        <div key={index} className="rounded border p-3">
                                                            <p>
                                                                <span className="font-medium">Jumlah Sheet Cetak:</span>{' '}
                                                                {sheetItem.jumlah_sheet_cetak || '-'}
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">Jumlah Total Sheet Cetak:</span>{' '}
                                                                {sheetItem.jumlah_total_sheet_cetak || '-'}
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">Jumlah Produksi:</span>{' '}
                                                                {sheetItem.jumlah_produksi || '-'}
                                                            </p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Bill of Materials */}
                                    {bomItems.length > 0 && (
                                        <div>
                                            <h3 className="mb-4 text-lg font-medium">Bill of Materials</h3>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Material</TableHead>
                                                        <TableHead>Departemen</TableHead>
                                                        <TableHead>Satuan</TableHead>
                                                        <TableHead>Qty</TableHead>
                                                        <TableHead>Waste</TableHead>
                                                        <TableHead>Total Kebutuhan</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {bomItems.map((bom, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{bom.bill_of_materials?.master_item?.nama_master_item}</TableCell>
                                                            <TableCell>{bom.bill_of_materials?.departemen?.nama_departemen}</TableCell>
                                                            <TableCell>{bom.bill_of_materials?.master_item?.unit?.nama_satuan}</TableCell>
                                                            <TableCell>{bom.bill_of_materials?.qty}</TableCell>
                                                            <TableCell>{formatToInteger(bom.waste)}</TableCell>
                                                            <TableCell>{bom.total_kebutuhan}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}

                                    {/* LIST INFORMASI PRODUKSI */}
                                    <div className="rounded-md border p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="flex items-center gap-2 text-lg font-medium">
                                                <Factory className="h-5 w-5" />
                                                List Informasi Produksi
                                            </h3>
                                            <ProductionDetailModal printings={printings} dieMakings={dieMakings} finishings={finishings} />
                                        </div>

                                        {/* Simple Production Summary Table */}
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50 dark:bg-gray-800">
                                                    <TableHead className="font-medium">Proses</TableHead>
                                                    <TableHead className="font-medium text-green-600">
                                                        <div className="flex items-center gap-1">
                                                            <CheckCircle className="h-4 w-4" />
                                                            Hasil Baik (Sheet)
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-medium text-red-600">
                                                        <div className="flex items-center gap-1">
                                                            <XCircle className="h-4 w-4" />
                                                            Hasil Rusak (Sheet)
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-medium text-yellow-600">
                                                        <div className="flex items-center gap-1">
                                                            <AlertTriangle className="h-4 w-4" />
                                                            Semi Waste (Sheet)
                                                        </div>
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {/* Printing Processes */}
                                                {printings.map((printing, index) => (
                                                    <TableRow key={`printing-${index}`}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Printer className="h-4 w-4 text-blue-600" />
                                                                {printing.proses_printing}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-lg font-semibold text-green-600">
                                                                {printing.hasil_baik_printing.toLocaleString()}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-lg font-semibold text-red-600">
                                                                {printing.hasil_rusak_printing.toLocaleString()}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-lg font-semibold text-yellow-600">
                                                                {printing.semi_waste_printing.toLocaleString()}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                                {/* Die Making Processes */}
                                                {dieMakings.map((diemaking, index) => (
                                                    <TableRow key={`diemaking-${index}`}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Wrench className="h-4 w-4 text-purple-600" />
                                                                {diemaking.proses_diemaking}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-lg font-semibold text-green-600">
                                                                {diemaking.hasil_baik_diemaking.toLocaleString()}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-lg font-semibold text-red-600">
                                                                {diemaking.hasil_rusak_diemaking.toLocaleString()}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-lg font-semibold text-yellow-600">
                                                                {diemaking.semi_waste_diemaking.toLocaleString()}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {/* Finishing Processes */}
                                                {finishings.map((finishing, index) => (
                                                    <TableRow key={`finishing-${index}`}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Sparkles className="h-4 w-4 text-orange-600" />
                                                                {finishing.proses_finishing}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-lg font-semibold text-green-600">
                                                                {finishing.hasil_baik_finishing.toLocaleString()}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-lg font-semibold text-red-600">
                                                                {finishing.hasil_rusak_finishing.toLocaleString()}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-lg font-semibold text-yellow-600">
                                                                {finishing.semi_waste_finishing.toLocaleString()}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                                {/* Empty State */}
                                                {printings.length === 0 && dieMakings.length === 0 && finishings.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                                                            <Factory className="mx-auto mb-3 h-12 w-12 opacity-50" />
                                                            <p>Belum ada data produksi untuk SPK ini</p>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* LIST TRANSFER BARANG JADI */}
                                    <div className="rounded-md border p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="flex items-center gap-2 text-lg font-medium">
                                                <Package className="h-5 w-5 text-indigo-600" />
                                                List Transfer Barang Jadi
                                            </h3>
                                        </div>

                                        {packagings.length > 0 ? (
                                            <>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-gray-50 dark:bg-gray-800">
                                                            <TableHead className="font-medium">Tanggal Transfer</TableHead>
                                                            <TableHead className="font-medium">Satuan Transfer</TableHead>
                                                            <TableHead className="font-medium">Jenis Transfer</TableHead>
                                                            <TableHead className="text-right font-medium">Transfer Barang Jadi (pcs)</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {packagings.map((packaging, index) => {
                                                            const totalPenuh = packaging.jumlah_satuan_penuh * packaging.qty_persatuan_penuh;
                                                            const totalSisa = packaging.jumlah_satuan_sisa * packaging.qty_persatuan_sisa;
                                                            const transferBarangJadi = totalPenuh + totalSisa;
                                                            return (
                                                                <TableRow key={`packaging-${index}`}>
                                                                    <TableCell>{format(new Date(packaging.tgl_transfer), 'dd-MM-yyyy')}</TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline" className="font-medium">
                                                                            {packaging.satuan_transfer}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant={
                                                                                packaging.jenis_transfer === 'Barang Hasil Baik'
                                                                                    ? 'default'
                                                                                    : packaging.jenis_transfer === 'Label Kuning'
                                                                                      ? 'secondary'
                                                                                      : 'destructive'
                                                                            }
                                                                        >
                                                                            {packaging.jenis_transfer}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <span className="text-lg font-semibold text-blue-600">
                                                                            {transferBarangJadi.toLocaleString()}
                                                                        </span>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>

                                                {/* Total Stok Barang Jadi */}
                                                <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg font-medium">Total Stok Barang Jadi:</span>
                                                        <span className="text-2xl font-bold text-blue-600">
                                                            {totalStokBarangJadi.toLocaleString()} pcs
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="py-8 text-center text-gray-500">
                                                <Package className="mx-auto mb-3 h-12 w-12 opacity-50" />
                                                <p>Belum ada data transfer barang jadi untuk SPK ini</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* List Surat Jalan */}
                                    <div className="rounded-md border p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="flex items-center gap-2 text-lg font-medium">
                                                <Truck className="h-5 w-5 text-indigo-600" />
                                                Pengiriman
                                            </h3>
                                        </div>

                                        {suratJalans.length > 0 ? (
                                            <>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-gray-50 dark:bg-gray-800">
                                                            <TableHead className="font-medium">Tanggal Surat Jalan</TableHead>
                                                            <TableHead className="font-medium">Pengirim</TableHead>
                                                            <TableHead className="font-medium">Driver</TableHead>
                                                            <TableHead className="text-right font-medium">Pengiriman (pcs)</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {suratJalans.map((suratJalan, index) => {
                                                            return (
                                                                <TableRow key={`suratJalan-${index}`}>
                                                                    <TableCell>
                                                                        {format(new Date(suratJalan.tgl_surat_jalan), 'dd-MM-yyyy')}
                                                                    </TableCell>
                                                                    <TableCell>{suratJalan.pengirim}</TableCell>
                                                                    <TableCell>{suratJalan.driver}</TableCell>
                                                                    <TableCell className="text-right">
                                                                        <span className="text-lg font-semibold text-blue-600">
                                                                            {suratJalan.qty_pengiriman.toLocaleString()}
                                                                        </span>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                                {/* Total Pengiriman */}
                                                <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg font-medium">Total Pengiriman:</span>
                                                        <span className="text-2xl font-bold text-blue-600">
                                                            {totalPengiriman.toLocaleString()} pcs
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="py-8 text-center text-gray-500">
                                                <Package className="mx-auto mb-3 h-12 w-12 opacity-50" />
                                                <p>Belum ada data pengiriman untuk SPK ini</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-start">
                                        <Link href={route('kartuInstruksiKerja.index')}>
                                            <Button variant="outline">Kembali</Button>
                                        </Link>
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
