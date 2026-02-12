import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BonPay } from '@/types/bonPay'; // Pastikan interface BonPay sudah sesuai
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';

const breadcrumbs = [
    { title: 'Bon Pay', href: route('bonPays.index') },
    { title: 'Detail', href: '#' },
];

export default function Show({ bonPay }: { bonPay: BonPay }) {
    // Fungsi untuk format mata uang
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Pembayaran ${bonPay.nomor_pembayaran}`} />

            <div className="mx-5 space-y-6 py-5">
                <div className="flex items-center justify-between">
                    <Link href={route('bonPays.index')}>
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" className="gap-2" onClick={() => window.print()}>
                            <Printer className="h-4 w-4" /> Cetak
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Kolom Kiri: Informasi Utama */}
                    <Card className="border-t-4 border-t-purple-500 md:col-span-2">
                        <CardHeader>
                            <CardTitle>Informasi Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Label className="text-muted-foreground">Nomor Pembayaran</Label>
                                    <p className="text-lg font-bold">{bonPay.nomor_pembayaran}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Tanggal Bayar</Label>
                                    <p className="font-medium">{bonPay.tanggal_pembayaran}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Metode Pembayaran</Label>
                                    <p className="font-medium">{bonPay.metode_bayar?.metode_bayar || '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Account (COA)</Label>
                                    <p className="font-medium">
                                        {bonPay.account?.kode_akuntansi} - {bonPay.account?.nama_akun}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <Label className="text-muted-foreground text-xs tracking-wider uppercase">Nominal Pembayaran</Label>
                                <p className="text-3xl font-extrabold text-purple-700">{formatCurrency(bonPay.nominal_pembayaran)}</p>
                            </div>

                            <div className="border-t pt-4">
                                <Label className="text-muted-foreground">Keterangan</Label>
                                <p className="rounded-md bg-slate-50 p-3 text-sm italic">{bonPay.keterangan || 'Tidak ada keterangan.'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kolom Kanan: Detail Terkait */}
                    <div className="space-y-6">
                        {/* Detail Invoice */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Detail Invoice</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <Label className="text-muted-foreground text-xs">No. Invoice</Label>
                                    <p className="font-medium text-blue-600">{bonPay.invoice?.no_invoice}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Customer</Label>
                                    <p className="font-medium">
                                        {bonPay.invoice?.surat_jalan?.kartu_instruksi_kerja?.sales_order?.customer_address?.nama_customer || '-'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin/Penerima */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">PIC / Penerima</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <Label className="text-muted-foreground text-xs">Nama Karyawan</Label>
                                    <p className="font-medium">{bonPay.karyawan?.nama || '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Gudang</Label>
                                    <p className="font-medium">{bonPay.gudang || '-'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
