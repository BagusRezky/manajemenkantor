import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Invoice } from '@/types/invoice';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Package, Receipt, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Invoice', href: '/invoices' },
    { title: 'Detail', href: '#' },
];

interface Props {
    invoice: Invoice;
}

export default function ShowInvoice({ invoice }: Props) {
    const isLegacy = invoice.is_legacy;

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
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

    // --- LOGIKA DATA SISTEM BARU ---
    const discount = Number(invoice.discount || 0);
    const qtySistem = Number(invoice.surat_jalan?.qty_pengiriman || 0);
    const hargaSistem = Number(invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.harga_pcs_bp || 0);
    const ppnRateSistem = Number(invoice.ppn || 0);
    const ongkirSistem = Number(invoice.ongkos_kirim || 0);
    const dpSistem = Number(invoice.uang_muka || 0);

    const subtotalSistem = hargaSistem * qtySistem - discount;
    const ppnNominalSistem = (subtotalSistem * ppnRateSistem) / 100;
    const totalSistem = subtotalSistem + ppnNominalSistem + ongkirSistem;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Invoice - ${invoice.no_invoice}`} />

            <div className="mx-5 py-5">
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">Detail Invoice </h1>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* CARD 1: INFORMASI INVOICE */}
                        <Card shadow-sm>
                            <CardHeader className="bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                                    <Receipt className="h-4 w-4" /> Data Header
                                    <div>
                                        <p className="text-sm text-gray-500">Kode: {invoice.kode || '-'}</p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">No. Invoice</p>
                                        <p className="font-mono font-bold">{invoice.no_invoice}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Tanggal Invoice</p>
                                        <p className="text-sm">{formatDate(invoice.tgl_invoice)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Jatuh Tempo</p>
                                        <p className="text-sm">{formatDate(invoice.tgl_jatuh_tempo)}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">No. Surat Jalan</p>
                                        <p className="text-sm">{isLegacy ? invoice.no_surat_jalan_lama : invoice.surat_jalan?.no_surat_jalan}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">No. SPK / KIK</p>
                                        <p className="text-sm">
                                            {isLegacy
                                                ? invoice.no_spk_lama || '-'
                                                : invoice.surat_jalan?.kartu_instruksi_kerja?.no_kartu_instruksi_kerja}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">No. Sales Order</p>
                                        <p className="text-sm">
                                            {isLegacy
                                                ? invoice.no_so_lama || '-'
                                                : invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.no_bon_pesanan}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CARD 2: INFORMASI CUSTOMER */}
                        <Card shadow-sm>
                            <CardHeader className="bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                                    <User className="h-4 w-4" /> Customer & Tujuan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Nama Customer</p>
                                    <p className="text-sm font-semibold">
                                        {isLegacy
                                            ? 'DATA LEGACY'
                                            : invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Alamat Tujuan</p>
                                    <p className="text-sm">{invoice.surat_jalan?.alamat_tujuan || '-'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CARD 3: RINCIAN ITEM (INI YANG KAMU TANYAKAN) */}
                        <Card shadow-sm className="overflow-hidden">
                            <CardHeader className="bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                                    <Package className="h-4 w-4" /> Rincian Item Barang
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-gray-100/50 text-[11px] font-bold text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Nama Barang</th>
                                            <th className="px-4 py-3 text-center">Qty</th>
                                            <th className="px-4 py-3 text-right">Harga Satuan</th>
                                            <th className="px-6 py-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {isLegacy ? (
                                            /* JIKA LEGACY: Loop dari invoice.details */
                                            invoice.details && invoice.details.length > 0 ? (
                                                invoice.details.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4">
                                                            <p className="font-bold">{item.nama_produk}</p>
                                                            <p className="text-[10px] text-gray-400">{item.kode_produk}</p>
                                                        </td>
                                                        <td className="px-4 py-4 text-center font-medium">
                                                            {Number(item.jumlah).toLocaleString('id-ID')} {item.unit}
                                                        </td>
                                                        <td className="px-4 py-4 text-right">{formatCurrency(Number(item.harga))}</td>
                                                        <td className="px-6 py-4 text-right font-bold">{formatCurrency(Number(item.total))}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="p-10 text-center text-gray-400 italic">
                                                        Data item legacy tidak ditemukan.
                                                    </td>
                                                </tr>
                                            )
                                        ) : (
                                            /* JIKA SISTEM: Ambil dari relasi surat_jalan */
                                            <tr>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold">
                                                        {invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.finish_good_item?.nama_barang}
                                                    </p>
                                                    <p className="text-xs font-normal text-gray-400">
                                                        {invoice.surat_jalan?.kartu_instruksi_kerja?.sales_order?.finish_good_item?.deskripsi}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-4 text-center font-medium">{qtySistem.toLocaleString('id-ID')} PCS</td>
                                                <td className="px-4 py-4 text-right">{formatCurrency(hargaSistem)}</td>
                                                <td className="px-6 py-4 text-right font-bold">{formatCurrency(hargaSistem * qtySistem)}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* PANEL SUMMARY (SISI KANAN) */}
                    <div className="space-y-6">
                        <Card shadow-md border-t-4 border-t-primary>
                            <CardHeader>
                                <CardTitle className="text-xs font-bold tracking-widest text-gray-400 uppercase">Ringkasan Biaya</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(isLegacy ? Number(invoice.total_sub) : hargaSistem * qtySistem)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-red-500">
                                    <span>Diskon</span>
                                    <span>- {formatCurrency(isLegacy ? Number(invoice.discount) : discount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>PPN</span>
                                    <span>{formatCurrency(isLegacy ? Number(invoice.ppn_nominal) : ppnNominalSistem)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Ongkir</span>
                                    <span>{formatCurrency(isLegacy ? Number(invoice.ongkos_kirim) : ongkirSistem)}</span>
                                </div>
                                <div className="flex items-center justify-between border-t-2 border-dashed pt-3">
                                    <span className="text-xs font-black uppercase">Total</span>
                                    <span className="text-primary text-xl font-black">
                                        {formatCurrency(isLegacy ? Number(invoice.total) : totalSistem)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-4 text-sm font-bold text-blue-600">
                                    <span>{isLegacy ? 'BAYAR / DP' : 'UANG MUKA'}</span>
                                    <span>{formatCurrency(isLegacy ? Number(invoice.bayar) : dpSistem)}</span>
                                </div>

                                {/* STATUS AREA: HANYA TAMPILKAN HASIL KEMBALI/SISA */}
                                <div className="mt-4 flex flex-col items-center rounded-lg border bg-gray-50 p-4">
                                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Sisa / Kembali</span>
                                    <span
                                        className={`text-2xl font-black ${(isLegacy ? Number(invoice.kembali) : totalSistem - dpSistem) < 0 ? 'text-red-600' : 'text-green-600'}`}
                                    >
                                        {formatCurrency(Math.abs(isLegacy ? Number(invoice.kembali) : totalSistem - dpSistem))}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {isLegacy && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 italic">
                                <strong>Catatan:</strong> {invoice.keterangan || 'Data ini hasil impor sistem lama.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
