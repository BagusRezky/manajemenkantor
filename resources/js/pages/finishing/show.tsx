/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Finishing } from '@/types/finishing';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';

interface Props {
    finishing: Finishing;
}

export default function ShowFinishing({ finishing }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Finishing', href: '/finishings' },
        { title: 'Detail', href: '#' },
    ];

    const totalQty = Number(finishing.hasil_baik_finishing) + Number(finishing.hasil_rusak_finishing) + Number(finishing.semi_waste_finishing);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Finishing - ${finishing.kode_finishing}`} />

            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link href={route('finishings.index')}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                </div>

                <Card className="overflow-hidden shadow-md">
                    <CardHeader className="bg-blue-600 text-white">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-blue-100" />
                                <div>
                                    <CardTitle className="text-xl">Laporan Hasil Finishing</CardTitle>
                                    <p className="text-sm text-blue-100">{finishing.kode_finishing}</p>
                                </div>
                            </div>
                            <div className="rounded-lg border border-white/30 bg-white/20 px-4 py-2 backdrop-blur-sm">
                                <p className="text-xs font-bold tracking-wider text-blue-50 uppercase">Tipe</p>
                                <p className="text-lg font-bold">{finishing.keterangan_finishing}</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Section 1: Produksi */}
                            <div className="space-y-4">
                                <h3 className="border-b pb-1 text-sm font-bold text-gray-500 uppercase">Detail Produksi</h3>
                                <div className="space-y-3">
                                    <InfoItem label="No. KIK" value={finishing.kartu_instruksi_kerja?.no_kartu_instruksi_kerja} />
                                    <InfoItem label="Mesin" value={finishing.mesin_finishing?.nama_mesin_finishing} />
                                    <InfoItem label="Operator" value={finishing.operator_finishing?.nama_operator_finishing} />
                                    <InfoItem
                                        label="Tanggal"
                                        value={new Date(finishing.tanggal_entri).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                    />
                                    <InfoItem label="Proses" value={finishing.proses_finishing} />
                                    <InfoItem label="Tahap" value={finishing.tahap_finishing} />
                                </div>
                            </div>

                            {/* Section 2: Hasil Qty */}
                            <div className="space-y-4">
                                <h3 className="border-b pb-1 text-sm font-bold text-gray-500 uppercase">Rekapitulasi Kuantitas</h3>
                                <div className="space-y-3">
                                    <QtyItem label="Hasil Baik" value={finishing.hasil_baik_finishing} color="text-green-600" />
                                    <QtyItem label="Hasil Rusak" value={finishing.hasil_rusak_finishing} color="text-red-600" />
                                    <QtyItem label="Semi Waste" value={finishing.semi_waste_finishing} color="text-yellow-600" />
                                    <div className="mt-3 flex items-center justify-between border-t-2 border-dashed pt-3">
                                        <span className="font-bold text-gray-800">Total Produksi</span>
                                        <span className="font-mono text-xl font-black text-blue-700">
                                            {totalQty.toLocaleString()} <span className="text-xs">Pcs</span>
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

function InfoItem({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex items-start justify-between border-b border-gray-50 py-1">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-right font-semibold text-gray-900">{value || '-'}</span>
        </div>
    );
}

function QtyItem({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <span className={`font-mono font-bold ${color}`}>
                {value.toLocaleString()} <span className="text-[10px] text-gray-400">Pcs</span>
            </span>
        </div>
    );
}
