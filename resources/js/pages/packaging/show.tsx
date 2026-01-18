import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Packaging } from '@/types/packaging';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Package } from 'lucide-react';

interface Props {
    packaging: Packaging;
}

export default function ShowPackaging({ packaging }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Packaging', href: '/packagings' },
        { title: 'Detail Packaging', href: '#' },
    ];

    const totalQty = packaging.jumlah_satuan_penuh * packaging.qty_persatuan_penuh + packaging.jumlah_satuan_sisa * packaging.qty_persatuan_sisa;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Packaging - ${packaging.kode_packaging}`} />

            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <Link href={route('packagings.index')}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                </div>

                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold">{packaging.kode_packaging}</CardTitle>
                            </div>
                            <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase dark:bg-blue-900/30 dark:text-blue-400">
                                {packaging.jenis_transfer}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8 pt-6">
                        {/* Info Utama */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold tracking-wider text-blue-600 uppercase">Informasi KIK</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between border-b py-1">
                                        <span className="text-muted-foreground">No. KIK</span>
                                        <span className="font-semibold">{packaging.kartu_instruksi_kerja?.no_kartu_instruksi_kerja}</span>
                                    </div>
                                    <div className="flex justify-between border-b py-1">
                                        <span className="text-muted-foreground">Tanggal Transfer</span>
                                        <span>{packaging.tgl_transfer}</span>
                                    </div>
                                    <div className="flex justify-between border-b py-1">
                                        <span className="text-muted-foreground">Satuan Dasar</span>
                                        <span className="font-medium text-orange-600">{packaging.satuan_transfer}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold tracking-wider text-blue-600 uppercase">Rincian Muatan</h3>
                                <div className="space-y-2 text-right text-sm">
                                    <p>
                                        Penuh: <span className="font-mono font-bold">{packaging.jumlah_satuan_penuh}</span> x{' '}
                                        {packaging.qty_persatuan_penuh}
                                    </p>
                                    <p>
                                        Sisa: <span className="font-mono font-bold">{packaging.jumlah_satuan_sisa}</span> x{' '}
                                        {packaging.qty_persatuan_sisa}
                                    </p>
                                    <div className="mt-4 rounded-lg bg-gray-900 p-4 dark:bg-blue-900/20">
                                        <div className="flex items-center justify-between">
                                            <Package className="h-5 w-5 text-blue-400" />
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 uppercase">Total Qty Transfer</p>
                                                <p className="text-2xl font-bold tracking-tight text-white">
                                                    {totalQty.toLocaleString()} <span className="text-xs font-normal">Pcs</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
