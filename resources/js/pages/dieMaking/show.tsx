import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DieMaking } from '@/types/dieMaking';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    dieMaking: DieMaking;
}

export default function ShowDieMaking({ dieMaking }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Die Making', href: '/dieMakings' },
        { title: 'Detail', href: '#' },
    ];

    const LabelValue = ({ label, value }: { label: string; value: string | number | undefined | null }) => (
        <div className="flex flex-col border-b py-3 sm:flex-row sm:justify-between">
            <span className="text-sm font-semibold text-gray-500 uppercase">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value || '-'}</span>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Die Making - ${dieMaking.kode_diemaking}`} />
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <Link href={route('dieMakings.index')}>
                        <Button variant="ghost">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                </div>

                <Card className="shadow-lg">
                    <CardHeader className="border-b bg-gray-50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold">Detail Laporan Produksi</CardTitle>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase">
                                {dieMaking.kode_diemaking}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
                            <div className="space-y-1">
                                <h3 className="mb-4 border-l-4 border-blue-600 pl-3 text-lg font-bold text-blue-600">Informasi Umum</h3>
                                <LabelValue label="No. SPK" value={dieMaking.kartu_instruksi_kerja?.no_kartu_instruksi_kerja} />
                                <LabelValue label="Mesin" value={dieMaking.mesin_diemaking?.nama_mesin_diemaking} />
                                <LabelValue label="Operator" value={dieMaking.operator_diemaking?.nama_operator_diemaking} />
                                <LabelValue label="Tanggal Entri" value={dieMaking.tanggal_entri} />
                                <LabelValue label="Tipe SPK" value={dieMaking.keterangan_diemaking} />
                            </div>

                            <div className="mt-8 space-y-1 md:mt-0">
                                <h3 className="mb-4 border-l-4 border-green-600 pl-3 text-lg font-bold text-green-600">Hasil Produksi</h3>
                                <LabelValue label="Proses" value={dieMaking.proses_diemaking} />
                                <LabelValue label="Tahap" value={dieMaking.tahap_diemaking} />
                                <LabelValue label="Hasil Baik" value={`${dieMaking.hasil_baik_diemaking} Pcs`} />
                                <LabelValue label="Hasil Rusak" value={`${dieMaking.hasil_rusak_diemaking} Pcs`} />
                                <LabelValue label="Semi Waste" value={`${dieMaking.semi_waste_diemaking} Pcs`} />
                                <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-900 p-4">
                                    <span className="text-xs font-bold text-white uppercase">Total Input</span>
                                    <span className="text-lg font-bold text-white">
                                        {Number(dieMaking.hasil_baik_diemaking) +
                                            Number(dieMaking.hasil_rusak_diemaking) +
                                            Number(dieMaking.semi_waste_diemaking)}{' '}
                                        Pcs
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
