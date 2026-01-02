import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Printing } from '@/types/printing';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    printing: Printing;
}

export default function ShowPrinting({ printing }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Printing', href: '/printings' },
        { title: 'Detail', href: '#' },
    ];

    const detailItem = (label: string, value: string | number | undefined) => (
        <div className="grid grid-cols-3 gap-4 border-b py-3 last:border-0">
            <span className="font-semibold text-gray-600">{label}</span>
            <span className="col-span-2 text-gray-900">{value || '-'}</span>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Printing - ${printing.kode_printing}`} />
            <div className="mx-auto max-w-4xl py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50">
                        <div>
                            <CardTitle className="text-xl">Detail Laporan Printing</CardTitle>
                            <p className="text-sm text-gray-500">{printing.kode_printing}</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href={route('printings.index')}>
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="mt-6">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Info Utama */}
                            <div className="space-y-1">
                                <h3 className="mb-4 text-sm font-bold tracking-wider text-blue-600 uppercase">Informasi Produksi</h3>
                                {detailItem('No. SPK', printing.kartu_instruksi_kerja?.no_kartu_instruksi_kerja)}
                                {detailItem('Mesin', printing.mesin?.nama_mesin)}
                                {detailItem('Operator', printing.operator?.nama_operator)}
                                {detailItem('Tanggal', printing.tanggal_entri)}
                                {detailItem('Status SPK', printing.keterangan_printing || '-')}
                            </div>

                            {/* Hasil Produksi */}
                            <div className="space-y-1">
                                <h3 className="mb-4 text-sm font-bold tracking-wider text-blue-600 uppercase">Hasil & Tahapan</h3>
                                {detailItem('Proses', printing.proses_printing)}
                                {detailItem('Tahap', printing.tahap_printing)}
                                {detailItem('Hasil Baik', `${printing.hasil_baik_printing} Pcs`)}
                                {detailItem('Hasil Rusak', `${printing.hasil_rusak_printing} Pcs`)}
                                {detailItem('Semi Waste', `${printing.semi_waste_printing} Pcs`)}
                                <div className="mt-4 rounded-lg bg-blue-50 p-4">
                                    <div className="flex justify-between font-bold text-blue-800">
                                        <span>Total Produksi</span>
                                        <span>
                                            {(printing.hasil_baik_printing || 0) +
                                                (printing.hasil_rusak_printing || 0) +
                                                (printing.semi_waste_printing || 0)}{' '}
                                            Pcs
                                        </span>
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
