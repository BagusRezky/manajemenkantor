import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaymentEntryGood } from '@/types/paymentEntryGood';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payment Entry Good',
        href: '/paymentEntryGoods',
    },
    {
        title: 'Detail',
        href: '#',
    },
];

interface ShowProps {
    paymentEntryGood: PaymentEntryGood;
}

export default function Show({ paymentEntryGood }: ShowProps) {
    const penerimaanBarang = paymentEntryGood.penerimaan_barang;
    const po = penerimaanBarang?.purchase_order;

    // Format helper
    const formatCurrency = (value: number | string | null | undefined) => {
        if (!value) return 'Rp 0';
        return `Rp ${Number(value).toLocaleString('id-ID')}`;
    };

    const formatDate = (date: string | null | undefined | Date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    // Hitung subtotal, ppn, dan total
    const diskon = Number(paymentEntryGood.diskon || 0);
    const hargaPerQty = Number(paymentEntryGood.harga_per_qty || 0);
    const qty = Number(penerimaanBarang?.items?.[0]?.qty_penerimaan || 0);
    const ppnRate = Number(paymentEntryGood.ppn || 0);

    const subtotal = qty * hargaPerQty - diskon;
    const ppnAmount = (subtotal * ppnRate) / 100;
    const total = subtotal + ppnAmount;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Payment Entry Good" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Payment Entry Good</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Informasi Umum */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label>No Tagihan:</Label>
                                    <p>{paymentEntryGood.no_tagihan || '-'}</p>
                                </div>
                                <div>
                                    <Label>Tanggal Transaksi:</Label>
                                    <p>{formatDate(paymentEntryGood.tanggal_transaksi )}</p>
                                </div>
                                <div>
                                    <Label>Tanggal Jatuh Tempo:</Label>
                                    <p>{formatDate(paymentEntryGood.tanggal_jatuh_tempo)}</p>
                                </div>
                                <div>
                                    <Label>Keterangan:</Label>
                                    <p>{paymentEntryGood.keterangan || '-'}</p>
                                </div>
                            </div>

                            {/* Detail Penerimaan Barang */}
                            <div className="rounded-md border bg-gray-50 p-4 dark:bg-gray-800">
                                <h3 className="mb-3 font-medium">Detail Penerimaan Barang</h3>
                                {penerimaanBarang ? (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <p>
                                                <span className="font-medium">No. Penerimaan Barang:</span> {penerimaanBarang.no_laporan_barang}
                                            </p>
                                            <p>
                                                <span className="font-medium">Tanggal Terima Barang:</span>{' '}
                                                {formatDate(penerimaanBarang.tgl_terima_barang)}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <span className="font-medium">No. PO:</span> {po?.no_po || '-'}
                                            </p>
                                            <p>
                                                <span className="font-medium">PPN PO:</span> {po?.ppn ? `${po.ppn}%` : '-'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Tidak ada data penerimaan barang.</p>
                                )}
                            </div>

                            {/* Rincian Harga */}
                            <Card className="bg-gray-50 dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-lg">Ringkasan Pembayaran</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Harga per Qty:</span>
                                            <span>{formatCurrency(hargaPerQty)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Qty Penerimaan:</span>
                                            <span>{qty}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Diskon:</span>
                                            <span>{formatCurrency(diskon)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>PPN ({ppnRate}%):</span>
                                            <span>{formatCurrency(ppnAmount)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <span>Total:</span>
                                            <span>{formatCurrency(total)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Link href={route('paymentEntryGoods.index')}>
                                    <Button variant="outline">Kembali</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
