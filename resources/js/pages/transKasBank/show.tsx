import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { TransKasBank } from '@/types/transKasBank';

import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CreditCard,
    Hash,
    Info,
    Landmark,
    LucideIcon,
    User,
} from 'lucide-react';

interface InfoRowProps {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
}

export default function Show({ item }: { item: TransKasBank }) {
    const isMasuk = item.transaksi === 21;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Bank', href: route('trans-kas-banks.index') },
        { title: 'Detail Transaksi Bank', href: '#' },
    ];

    const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

    const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
        <div className="flex flex-col space-y-1">
            <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
            </div>
            <p className="text-sm font-medium md:text-base">{value || '-'}</p>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Bank - ${item.no_bukti}`} />

            <div className="mx-auto max-w-4xl py-5">
                <div className="mb-4 flex items-center justify-between print:hidden">
                    <Link href={route('trans-kas-banks.index')}>
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Button>
                    </Link>

                </div>

                <Card className={`border-t-8 ${isMasuk ? 'border-t-blue-500' : 'border-t-orange-500'} print:border-none print:shadow-none`}>
                    <CardHeader className="flex flex-col items-start justify-between gap-4 border-b pb-6 md:flex-row md:items-center">
                        <div className="flex items-center gap-4">
                            <div className={`rounded-full p-3 ${isMasuk ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                <Landmark className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black tracking-tight uppercase">
                                    Bukti Transaksi Bank {isMasuk ? 'Masuk' : 'Keluar'}
                                </CardTitle>
                                <p className="text-muted-foreground font-mono text-sm">{item.no_bukti}</p>
                            </div>
                        </div>
                        {/* Perbaikan Badge: Gunakan 'secondary' atau 'outline' karena 'warning' tidak ada di shadcn default */}
                        <Badge variant={isMasuk ? 'default' : 'secondary'} className="text-md px-4">
                            {isMasuk ? 'BANK IN' : 'BANK OUT'}
                        </Badge>
                    </CardHeader>

                    <CardContent className="space-y-8 py-8">
                        <div className="bg-muted/30 grid grid-cols-2 gap-6 rounded-lg p-4 md:grid-cols-3">
                            <InfoRow icon={Calendar} label="Tanggal Transaksi" value={item.tanggal_transaksi || '-'} />
                            <InfoRow icon={Hash} label="Periode" value={item.periode} />
                            <InfoRow icon={Hash} label="Gudang" value={item.gudang} />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <InfoRow
                                icon={CreditCard}
                                label="Akun Utama"
                                value={`${item.account_bank?.kode_akuntansi} - ${item.account_bank?.nama_akun}`}
                            />
                            <InfoRow
                                icon={CreditCard}
                                label="Akun Lawan"
                                value={`${item.account_bank_lain?.kode_akuntansi} - ${item.account_bank_lain?.nama_akun}`}
                            />
                        </div>

                        <div className="border-l-muted space-y-4 border-l-4 pl-6 italic">
                            <h4 className="text-muted-foreground text-xs font-bold uppercase not-italic">Informasi Rekening:</h4>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <InfoRow icon={Landmark} label="Nama Bank" value={item.bank} />
                                <InfoRow icon={User} label="Atas Nama" value={item.bank_an} />
                                <InfoRow icon={Hash} label="No. Rekening" value={item.no_rekening} />
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="bg-muted/10 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8">
                                <span className="text-muted-foreground mb-2 text-xs font-bold uppercase">Total Transaksi</span>
                                <span className={`text-5xl font-black ${isMasuk ? 'text-blue-600' : 'text-orange-600'}`}>
                                    {formatCurrency(item.nominal)}
                                </span>
                            </div>

                            <div className="mt-6 flex gap-3">
                                {/* Perbaikan Icon: Langsung render komponennya, bukan lewat prop icon */}
                                <Info className="text-muted-foreground mt-1 h-5 w-5" />
                                <div className="space-y-1">
                                    <span className="text-muted-foreground text-sm font-bold uppercase">Keterangan:</span>
                                    <p className="text-sm leading-relaxed md:text-base">{item.keterangan || 'Tidak ada memo.'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="hidden grid-cols-3 gap-12 pt-16 text-center print:grid">
                            <div className="border-t border-black pt-2 text-xs font-bold uppercase">Administrasi</div>
                            <div className="border-t border-black pt-2 text-xs font-bold uppercase">Otorisasi</div>
                            <div className="border-t border-black pt-2 text-xs font-bold uppercase">Penerima</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
