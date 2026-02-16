import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { TransPayment } from '@/types/transPayment';
import { Head } from '@inertiajs/react';
import { Calendar, CreditCard, Hash, Landmark, User, Warehouse } from 'lucide-react';

export default function Show({ item }: { item: TransPayment }) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const totalBayar = item.details?.reduce((sum, d) => sum + Number(d.nominal), 0) || 0;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Pembayaran', href: route('transPayments.index') },
                { title: 'Detail Transaksi', href: '#' },
            ]}
        >
            <Head title={`Detail Pembayaran - ${item.no_pembayaran}`} />

            <div className="mx-auto max-w-7xl space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{item.no_pembayaran}</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> {item.tanggal_header || '-'}
                            <span className="mx-2">•</span>
                            <Badge variant="secondary">{item.periode}</Badge>
                        </p>
                    </div>
                    <div className="bg-primary/10 border-primary/20 rounded-xl border p-4 text-right">
                        <p className="text-primary text-xs font-medium tracking-wider uppercase">Total Pembayaran</p>
                        <p className="text-primary text-3xl font-black">{formatCurrency(totalBayar)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 ">
                    {/* Informasi Utama */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Hash className="h-5 w-5" /> Informasi Umum
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Gudang / Lokasi</p>
                                <p className="flex items-center gap-2 font-medium">
                                    <Warehouse className="text-muted-foreground h-4 w-4" /> {item.gudang}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Karyawan / PIC</p>
                                <p className="flex items-center gap-2 font-medium">
                                    <User className="text-muted-foreground h-4 w-4" />
                                    {item.karyawan?.nama || 'Tidak ditentukan'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Referensi PO Billing</p>
                                <p className="font-semibold text-blue-600">{item.po_billing?.no_bukti_tagihan || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Invoice Vendor</p>
                                <p className="font-medium">{item.po_billing?.invoice_vendor || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabel Rincian */}
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/30">
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" /> Rincian Item Pembayaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/20">
                                    <TableHead className="w-[150px]">Metode & Tgl</TableHead>
                                    <TableHead>Akun (Debit/Kredit)</TableHead>
                                    <TableHead>Informasi Bank</TableHead>
                                    <TableHead>Keterangan</TableHead>
                                    <TableHead className="text-right">Nominal (Curs)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {item.details && item.details.length > 0 ? (
                                    item.details.map((d) => (
                                        <TableRow key={d.id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell>
                                                <Badge variant="outline" className="mb-1 block w-fit">
                                                    {d.metode_bayar?.metode_bayar || d.id_metode_bayar}
                                                </Badge>
                                                <span className="text-muted-foreground text-[10px] uppercase">{d.tanggal_pembayaran}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <Badge variant="secondary" className="h-4 text-[10px]">
                                                            D
                                                        </Badge>
                                                        <span className="text-xs">{d.account_debit?.nama_akun || d.id_account_debit}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Badge variant="outline" className="h-4 text-[10px]">
                                                            K
                                                        </Badge>
                                                        <span className="text-xs">{d.account_kredit?.nama_akun || d.id_account_kredit}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-start gap-2">
                                                    <Landmark className="text-muted-foreground mt-0.5 h-4 w-4" />
                                                    <div>
                                                        <p className="text-sm font-medium">{d.bank || '-'}</p>
                                                        <p className="text-muted-foreground text-xs">
                                                            {d.no_rekening} <br />
                                                            <span className="italic">a/n {d.an_rekening}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-muted-foreground max-w-[200px] truncate text-sm italic" title={d.keterangan}>
                                                    {d.keterangan || '-'}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <p className="font-mono text-base font-bold">{formatCurrency(d.nominal)}</p>
                                                <p className="text-muted-foreground font-mono text-[10px]">Curs: {d.curs}</p>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-muted-foreground py-10 text-center">
                                            Tidak ada rincian pembayaran.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
