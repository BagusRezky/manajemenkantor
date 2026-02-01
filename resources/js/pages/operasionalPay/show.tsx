import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { OperasionalPay } from '@/types/operasionalPay';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Home, LucideIcon, Receipt, Truck, User, Wallet } from 'lucide-react';

interface InfoRowProps {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
}

export default function Show({ item }: { item: OperasionalPay }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Operasional', href: route('operasionalPays.index') },
        { title: 'Detail Biaya', href: '#' },
    ];

    const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

    const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
        <div className="bg-background flex flex-col space-y-1 rounded-lg border p-3 shadow-sm">
            <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                <Icon className="h-3.5 w-3.5 text-purple-500" />
                <span>{label}</span>
            </div>
            <p className="text-sm font-semibold">{value || '-'}</p>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Operasional - ${item.no_bukti}`} />

            <div className="mx-auto max-w-5xl py-5">
                <div className="mb-4 flex items-center justify-between print:hidden">
                    <Link href={route('operasionalPays.index')}>
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                </div>

                <Card className="border-t-8 border-t-purple-500 shadow-xl print:border-none print:shadow-none">
                    <CardHeader className="bg-muted/20 flex flex-col items-start justify-between gap-4 border-b pb-6 md:flex-row md:items-center">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                                <Receipt className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black tracking-tight uppercase">Operasional Keluar</CardTitle>
                                <p className="text-muted-foreground font-mono text-sm">{item.no_bukti}</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8 py-8">
                        {/* Row 1: Time & Place */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <InfoRow
                                icon={Calendar}
                                label="Tanggal Transaksi"
                                value={
                                    item.tanggal_transaksi ? new Date(item.tanggal_transaksi).toLocaleDateString('id-ID', { dateStyle: 'full' }) : '-'
                                }
                            />
                            <InfoRow icon={Home} label="Gudang / Lokasi" value={item.gudang} />
                            <InfoRow icon={User} label="PIC / Karyawan" value={item.karyawan?.nama} />
                        </div>

                        <Separator />

                        {/* Row 2: Accounting Details */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="border-muted-foreground/20 space-y-4 rounded-xl border-2 border-dashed p-4">
                                <h4 className="text-muted-foreground text-xs font-black tracking-widest uppercase"> Account</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Account Kas:</span>
                                        <span className="text-sm font-bold">{item.account_kas?.nama_akun}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Account Beban:</span>
                                        <span className="text-sm font-bold">{item.account_beban?.nama_akun}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Vehicle Info (Jika ada) */}
                            {(item.nopol || item.odometer) && (
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoRow icon={Truck} label="No. Polisi" value={item.nopol} />
                                    <InfoRow icon={Truck} label="Odometer" value={item.odometer} />
                                </div>
                            )}
                        </div>

                        {/* Nominal Section */}
                        <div className="relative overflow-hidden rounded-2xl bg-purple-900 p-8 text-white shadow-inner">
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="mb-2 text-xs font-bold tracking-[0.3em] uppercase opacity-80">Total Pengeluaran</span>
                                <span className="text-5xl font-black">{formatCurrency(item.nominal)}</span>
                            </div>
                            {/* Decorative background icon */}
                            <Wallet className="absolute -right-8 -bottom-8 h-40 w-40 rotate-12 opacity-10" />
                        </div>

                        {/* Keterangan */}
                        <div className="space-y-2">
                            <span className="text-muted-foreground text-xs font-black tracking-widest uppercase">Memo / Keterangan</span>
                            <div className="bg-muted min-h-[100px] rounded-lg border p-4 text-sm italic">
                                {item.keterangan || 'Tidak ada keterangan tambahan.'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
