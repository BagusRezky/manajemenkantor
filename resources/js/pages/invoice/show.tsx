import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Invoice } from '@/types/invoice';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Calendar, DollarSign, FileText, MapPin, Package, Receipt, Truck, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Invoice', href: '/invoices' },
    { title: 'Detail', href: '#' },
];

interface Props {
    invoice: Invoice;
}

export default function ShowInvoice({ invoice }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Perhitungan invoice
    const harga = Number(invoice.harga || 0);
    const qtyPengiriman = Number(invoice.surat_jalan?.qty_pengiriman || 0);
    const toleransiPengiriman = Number(invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.toleransi_pengiriman || 0);
    const ppnRate = Number(invoice.ppn || 0);
    const ongkosKirim = Number(invoice.ongkos_kirim || 0);
    const uangMuka = Number(invoice.uang_muka || 0);

    // Hitung subtotal
    const subtotalSebelumToleransi = harga * qtyPengiriman;
    const potonganToleransi = (subtotalSebelumToleransi * toleransiPengiriman) / 100;
    const subtotal = subtotalSebelumToleransi - potonganToleransi;

    // Hitung PPN dan total
    const ppnAmount = (subtotal * ppnRate) / 100;
    const total = subtotal + ppnAmount + ongkosKirim;
    const sisaTagihan = total - uangMuka;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Invoice - ${invoice.no_invoice}`} />

            <div className="mx-5 py-5">
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">Detail Invoice</h1>
                </div>

                <div className="space-y-6">
                    {/* Header Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5" />
                                    <span>Informasi Invoice</span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                        <FileText className="h-4 w-4" />
                                        No. Invoice
                                    </label>
                                    <p className="mt-1 font-mono text-sm text-gray-900">{invoice.no_invoice}</p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        Tanggal Invoice
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(invoice.tgl_invoice)}</p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                        <Calendar className="h-4 w-4 text-red-500" />
                                        Tanggal Jatuh Tempo
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(invoice.tgl_jatuh_tempo)}</p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                        <Truck className="h-4 w-4" />
                                        No. Surat Jalan
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{invoice.surat_jalan?.no_surat_jalan || '-'}</p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                        <Package className="h-4 w-4" />
                                        No. SPK
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {invoice.surat_jalan?.kartu_instruksi_kerja?.no_kartu_instruksi_kerja || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                        <Receipt className="h-4 w-4" />
                                        No. Sales Order
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.no_bon_pesanan || '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informasi Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nama Customer</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                        <MapPin className="h-4 w-4" />
                                        Alamat Tujuan
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{invoice.surat_jalan?.alamat_tujuan || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Informasi Produk
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nama Barang</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.finish_good_item?.nama_barang || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.finish_good_item?.deskripsi || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Qty Pengiriman</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        <span className="font-semibold">{qtyPengiriman.toLocaleString('id-ID')}</span> pcs
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Harga Satuan</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(harga)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Toleransi Pengiriman</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        <span className="font-semibold">{toleransiPengiriman}%</span>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">PPN</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        <span className="font-semibold">{ppnRate}%</span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invoice Calculation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Perhitungan Invoice
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <tbody className="divide-y divide-gray-200">
                                            <tr>
                                                <td className="py-3 text-sm text-gray-600">Subtotal Sebelum Toleransi:</td>
                                                <td className="py-3 text-right text-sm font-medium">
                                                    {harga.toLocaleString('id-ID')} × {qtyPengiriman.toLocaleString('id-ID')} ={' '}
                                                    {formatCurrency(subtotalSebelumToleransi)}
                                                </td>
                                            </tr>
                                            {toleransiPengiriman > 0 && (
                                                <tr>
                                                    <td className="py-3 text-sm text-gray-600">Potongan Toleransi ({toleransiPengiriman}%):</td>
                                                    <td className="py-3 text-right text-sm font-medium text-red-600">
                                                        - {formatCurrency(potonganToleransi)}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr className="border-t-2">
                                                <td className="py-3 text-sm font-semibold text-gray-900">Subtotal:</td>
                                                <td className="py-3 text-right text-sm font-semibold">{formatCurrency(subtotal)}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 text-sm text-gray-600">PPN ({ppnRate}%):</td>
                                                <td className="py-3 text-right text-sm font-medium">{formatCurrency(ppnAmount)}</td>
                                            </tr>
                                            {ongkosKirim > 0 && (
                                                <tr>
                                                    <td className="py-3 text-sm text-gray-600">Ongkos Kirim:</td>
                                                    <td className="py-3 text-right text-sm font-medium">{formatCurrency(ongkosKirim)}</td>
                                                </tr>
                                            )}
                                            <tr className="border-t-2">
                                                <td className="py-3 text-lg font-bold text-gray-900">Total:</td>
                                                <td className="py-3 text-right text-lg font-bold text-green-600">{formatCurrency(total)}</td>
                                            </tr>
                                            {uangMuka > 0 && (
                                                <>
                                                    <tr>
                                                        <td className="py-3 text-sm text-gray-600">Uang Muka:</td>
                                                        <td className="py-3 text-right text-sm font-medium">{formatCurrency(uangMuka)}</td>
                                                    </tr>
                                                    <tr className="border-t-2">
                                                        <td className="py-3 text-lg font-bold text-gray-900">Sisa Tagihan:</td>
                                                        <td className="py-3 text-right text-lg font-bold text-blue-600">
                                                            {formatCurrency(sisaTagihan)}
                                                        </td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
