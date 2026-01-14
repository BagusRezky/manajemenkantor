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

    const totalQty = (packaging.jumlah_satuan_penuh * packaging.qty_persatuan_penuh) +
                     (packaging.jumlah_satuan_sisa * packaging.qty_persatuan_sisa);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Packaging - ${packaging.kode_packaging}`} />

            <div className="mx-auto max-w-4xl py-10 px-4">
                <div className="mb-6 flex items-center justify-between">
                    <Link href={route('packagings.index')}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Button>
                    </Link>

                </div>

                <Card className="overflow-hidden">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl font-bold">{packaging.kode_packaging}</CardTitle>

                            </div>
                            <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                {packaging.jenis_transfer}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-8">
                        {/* Info Utama */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Informasi KIK</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="text-muted-foreground">No. KIK</span>
                                        <span className="font-semibold">{packaging.kartu_instruksi_kerja?.no_kartu_instruksi_kerja}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="text-muted-foreground">Tanggal Transfer</span>
                                        <span>{packaging.tgl_transfer}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="text-muted-foreground">Satuan Dasar</span>
                                        <span className="font-medium text-orange-600">{packaging.satuan_transfer}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Rincian Muatan</h3>
                                <div className="space-y-2 text-sm text-right">
                                    <p>Penuh: <span className="font-mono font-bold">{packaging.jumlah_satuan_penuh}</span> x {packaging.qty_persatuan_penuh}</p>
                                    <p>Sisa: <span className="font-mono font-bold">{packaging.jumlah_satuan_sisa}</span> x {packaging.qty_persatuan_sisa}</p>
                                    <div className="mt-4 p-4 bg-gray-900 rounded-lg dark:bg-blue-900/20">
                                        <div className="flex justify-between items-center">
                                            <Package className="text-blue-400 h-5 w-5" />
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 uppercase">Total Qty Transfer</p>
                                                <p className="text-2xl font-bold text-white tracking-tight">
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
