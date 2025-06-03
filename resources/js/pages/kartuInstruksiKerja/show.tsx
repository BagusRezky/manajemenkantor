
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { formatToInteger } from '@/utils/formatter/decimaltoint';
import { Head, Link } from '@inertiajs/react';



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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail KIK - ${kartuInstruksiKerja.no_kartu_instruksi_kerja}`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Detail Kartu Instruksi Kerja</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        {/* No Kartu Instruksi Kerja */}
                                        <div className="space-y-2">
                                            <Label htmlFor="no_kartu_instruksi_kerja">No. Kartu Instruksi Kerja</Label>
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
                                        <div className="rounded-md border p-4">
                                            <h3 className="mb-4 text-lg font-medium">Detail Sales Order</h3>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <p>
                                                        <span className="font-medium">No Bon Pesanan:</span> {salesOrder.no_bon_pesanan}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">No PO Customer:</span> {salesOrder.no_po_customer}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Customer:</span> {salesOrder.customer_address?.nama_customer}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Harga pcs bp:</span> {salesOrder.harga_pcs_bp}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Nama Barang:</span> {finishGoodItem?.nama_barang}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Deskripsi:</span> {finishGoodItem?.deskripsi}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Jumlah Up:</span> UP 1: {finishGoodItem?.up_satu} | UP 2:{' '}
                                                        {finishGoodItem?.up_dua} | UP 3: {finishGoodItem?.up_tiga}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Ukuran Potong | Ukuran Cetak:</span>{' '}
                                                        {finishGoodItem?.ukuran_potong} | {finishGoodItem?.ukuran_cetak}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p>
                                                        <span className="font-medium">Jumlah Pesanan:</span> {salesOrder.jumlah_pesanan}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Toleransi Pengiriman:</span> {salesOrder.toleransi_pengiriman}%
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Tipe Pesanan:</span> {salesOrder.tipe_pesanan}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Mata Uang:</span> {salesOrder.mata_uang}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Syarat Pembayaran:</span> {salesOrder.syarat_pembayaran}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Properti:</span> Panjang {finishGoodItem?.panjang}, Lebar{' '}
                                                        {finishGoodItem?.lebar}, tinggi {finishGoodItem?.tinggi}, Berat Kotor{' '}
                                                        {finishGoodItem?.berat_kotor}, Berat Bersih {finishGoodItem?.berat_bersih}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Tanggal Pesanan:</span> {salesOrder.eta_marketing}
                                                    </p>
                                                </div>
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
