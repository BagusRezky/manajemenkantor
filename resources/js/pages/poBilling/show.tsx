import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PoBilling, PoBillingDetail } from '@/types/poBilling';
import { Head } from '@inertiajs/react';

// Fungsi helper format mata uang
const rupiah = (v?: number | null) => `Rp ${(v ?? 0).toLocaleString('id-ID')}`;

/**
 * Interface tambahan jika di file types belum ada no_po_asal
 * Jika sudah ada di file asli, bagian ini bisa diabaikan.
 */
interface ExtendedPoBilling extends PoBilling {
    no_po_asal?: string | null;
}

export default function Show({ billing }: { billing: ExtendedPoBilling }) {
    const details = billing.details ?? [];

    /**
     * PENENTU DATA LEGACY:
     * Jika no_po_asal tidak null, berarti data migrasi (Legacy).
     * Jika no_po_asal null, berarti data baru hasil input sistem.
     */
    const isLegacy = billing.no_po_asal !== null && billing.no_po_asal !== undefined;


    /**
     * Logic Perhitungan Baris:
     * 1. Legacy: Mengutamakan kolom total_semua dari DB.
     * 2. New: Menghitung (qty * harga) - diskon di sisi Frontend.
     */
    const getRowTotal = (dt: PoBillingDetail) => {
        if (isLegacy && dt.total_semua != null) {
            return dt.total_semua;
        }
        // Kalkulasi sistem baru
        const subtotal = dt.qty * dt.harga_per_qty;
        const diskonNominal = subtotal * ((dt.discount ?? 0) / 100);
        return subtotal - diskonNominal;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Billing', href: route('poBillings.index') },
                { title: 'Detail', href: '#' },
            ]}
        >
            <Head title={`Detail Billing - ${billing.no_bukti_tagihan}`} />

            <div className="space-y-6 p-6">
                {/* ================= HEADER INFORMASI ================= */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-xl font-bold">Informasi Tagihan: {billing.no_bukti_tagihan}</CardTitle>

                        {isLegacy ? (
                            <Badge variant="outline" className="border-amber-200 bg-amber-50 font-bold tracking-wider text-amber-700 uppercase">
                                📜 Data Migrasi (Legacy)
                            </Badge>
                        ) : (
                            <Badge className="bg-emerald-600 font-bold tracking-wider uppercase">✨ Sistem Baru</Badge>
                        )}
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 gap-6 border-t pt-6 md:grid-cols-4">
                        <div>
                            <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">Gudang</p>
                            <p className="text-sm font-medium">{billing.gudang}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">
                                {isLegacy ? 'PO Asal (Legacy)' : 'Ref. Purchase Order'}
                            </p>
                            <p className="text-sm font-medium">
                                {isLegacy ? <span className="text-amber-700">{billing.no_po_asal}</span> : (billing.purchase_order?.no_po ?? '-')}
                            </p>
                        </div>

                        <div>
                            <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">Tanggal Transaksi</p>
                            <p className="text-sm font-medium">{billing.tanggal_transaksi ?? '-'}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">Invoice Vendor</p>
                            <p className="text-sm font-medium">{billing.invoice_vendor || '-'}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">Jatuh Tempo</p>
                            <p className="text-sm font-medium">{billing.jatuh_tempo ?? '-'}</p>
                        </div>

                        <div>
                            <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">Admin / Karyawan</p>
                            <p className="text-sm font-medium">{billing.karyawan?.nama ?? '-'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* ================= RINCIAN BARANG ================= */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Rincian Item</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead className="w-[40%] text-xs font-bold text-slate-700 uppercase">Item</TableHead>
                                    <TableHead className="text-right text-xs font-bold text-slate-700 uppercase">Qty</TableHead>
                                    <TableHead className="text-right text-xs font-bold text-slate-700 uppercase">Harga</TableHead>
                                    <TableHead className="text-right text-xs font-bold text-slate-700 uppercase">Disc</TableHead>
                                    <TableHead className="text-right text-xs font-bold text-slate-700 uppercase">Total</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {details.length > 0 ? (
                                    details.map((dt) => (
                                        <TableRow key={dt.id} className="hover:bg-slate-50/50">
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-slate-900">{dt.master_item}</span>
                                                    {isLegacy && (
                                                        <span className="w-fit rounded bg-amber-100 px-1 text-[9px] font-bold text-amber-800 uppercase italic">
                                                            migrated-row
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right font-medium">
                                                {dt.qty} <span className="text-muted-foreground ml-1 text-[10px]">{dt.unit ?? ''}</span>
                                            </TableCell>

                                            <TableCell className="text-right">{rupiah(dt.harga_per_qty)}</TableCell>

                                            <TableCell className="text-right font-medium text-red-600">
                                                {dt.discount > 0 ? `${dt.discount}%` : '-'}
                                            </TableCell>

                                            <TableCell className="text-right font-bold text-slate-900">{rupiah(getRowTotal(dt))}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-muted-foreground py-12 text-center italic">
                                            Tidak ada rincian item tersedia.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* ================= RINGKASAN BIAYA ================= */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Keterangan di sebelah kiri */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-muted-foreground text-sm uppercase">Catatan / Keterangan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 italic">{billing.keterangan || 'Tidak ada keterangan tambahan.'}</p>
                        </CardContent>
                    </Card>

                    {/* Totalan di sebelah kanan */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Total Nilai Barang</span>
                                    <span className="font-semibold">{rupiah(billing.total_nilai_barang)}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-red-500">PPN (Masukan)</span>
                                    <span className="font-semibold text-red-600">+ {rupiah(billing.ppn)}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-red-500">Biaya Pengiriman</span>
                                    <span className="font-semibold text-red-600">+ {rupiah(billing.ongkir)}</span>
                                </div>

                                <div className="flex items-center justify-between border-b pb-3 text-sm">
                                    <span className="font-medium text-emerald-600">Uang Muka (DP)</span>
                                    <span className="font-semibold text-emerald-600">- {rupiah(billing.dp)}</span>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-lg font-black uppercase">Total Akhir</span>
                                    <span className="text-primary text-2xl font-black tracking-tight">{rupiah(billing.total_akhir)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
