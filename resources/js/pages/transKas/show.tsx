import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { TransKas } from '@/types/transKas';

import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, CreditCard, Home, LucideIcon, Tag, User } from 'lucide-react';

interface InfoRowProps {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
}

export default function Show({ item }: { item: TransKas }) {
    const isMasuk = item.transaksi === 1;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Kas', href: route('trans-kas.index') },
        { title: 'Detail Transaksi', href: '#' },
    ];

    const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

    const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
        <div className="flex flex-col space-y-1">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
            <p className="text-sm font-semibold md:text-base">{value || '-'}</p>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Transaksi - ${item.no_bukti}`} />

            <div className="mx-auto max-w-4xl py-5">
                <div className="mb-4 flex items-center justify-between print:hidden">
                    <Link href={route('trans-kas.index')}>
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                </div>

                <Card className={`border-t-8 ${isMasuk ? 'border-t-green-500' : 'border-t-red-500'} print:border-none print:shadow-none`}>
                    <CardHeader className="flex flex-col items-start justify-between gap-4 border-b md:flex-row md:items-center">
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight uppercase"> Kas {isMasuk ? 'Masuk' : 'Keluar'}</CardTitle>
                            <p className="text-muted-foreground font-mono">{item.no_bukti}</p>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8 py-8">
                        {/* Section 1: Data Utama */}
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                            <InfoRow icon={Home} label="Gudang" value={item.gudang} />
                            <InfoRow icon={Tag} label="Periode" value={item.periode} />
                            <InfoRow icon={Calendar} label="Tanggal Transaksi" value={item.tanggal_transaksi} />
                        </div>

                        <Separator />

                        {/* Section 2: Aliran Dana */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className={`rounded-lg p-4 ${isMasuk ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
                                <InfoRow
                                    icon={CreditCard}
                                    label={isMasuk ? 'Debet (Kas Bertambah)' : 'Kredit (Kas Berkurang)'}
                                    value={`${item.account_kas?.kode_akuntansi} - ${item.account_kas?.nama_akun}`}
                                />
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <InfoRow
                                    icon={CreditCard}
                                    label={isMasuk ? 'Kredit (Sumber Dana)' : 'Debet (Beban/Tujuan)'}
                                    value={`${item.account_kas_lain?.kode_akuntansi} - ${item.account_kas_lain?.nama_akun}`}
                                />
                            </div>
                        </div>

                        {/* Section 3: PIC & Entitas */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <InfoRow icon={User} label="Karyawan" value={item.karyawan?.nama} />
                            <InfoRow icon={User} label="Customer" value={item.customer_address?.nama_customer} />
                        </div>

                        {/* Section 4: Nominal */}
                        <div className="space-y-4">
                            <div className="flex flex-col items-end border-y py-6">
                                <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">Total Transaksi</span>
                                <span className={`text-4xl font-black ${isMasuk ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(item.nominal)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-muted-foreground italic">Keterangan / Memo:</Label>
                                <p className="bg-muted/20 min-h-[100px] rounded border border-dashed p-4">
                                    {item.keterangan || 'Tidak ada catatan.'}
                                </p>
                            </div>
                        </div>

                        {/* Tanda Tangan Khusus Print */}
                        <div className="hidden grid-cols-3 gap-8 pt-16 text-center print:grid">
                            <div className="flex h-32 flex-col justify-between">
                                <p className="text-sm">Dibukukan Oleh,</p>
                                <p className="mx-4 border-t border-black pt-1 font-bold">Staff Keuangan</p>
                            </div>
                            <div className="flex h-32 flex-col justify-between">
                                <p className="text-sm">Diperiksa Oleh,</p>
                                <p className="mx-4 border-t border-black pt-1 font-bold">Manager</p>
                            </div>
                            <div className="flex h-32 flex-col justify-between">
                                <p className="text-sm">Diterima Oleh,</p>
                                <p className="mx-4 border-t border-black pt-1 font-bold">Pihak Terkait</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
