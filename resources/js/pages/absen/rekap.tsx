import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { RekapAbsen } from '@/types/rekapAbsen';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { columns } from './table/rekap/columns';
import { DataTable } from './table/rekap/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Absensi', href: route('absens.index') },
    { title: 'Rekap', href: route('absens.rekap') },
];

interface RekapAbsenProps {
    rekap?: RekapAbsen[]; // optional, sebab kita fallback
    filters?: {
        start_date?: string;
        end_date?: string;
    };
}

export default function RekapAbsenPage({ rekap = [], filters }: RekapAbsenProps) {
    // server-side date filter (kirim ke backend)
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');

    // gunakan data yang dikirim backend langsung — rekap sudah teragregasi per karyawan
    const data = rekap; // guaranteed array by default parameter

    // summary dari server-data (jika mau summary FE)
    const totalHadir = data.reduce((a, b) => a + (b.hadir || 0), 0);
    const totalIzin = data.reduce((a, b) => a + (b.izin_kali || 0), 0);
    const totalCuti = data.reduce((a, b) => a + (b.cuti_kali || 0), 0);

    const applyDateFilter = () => {
        if (!startDate || !endDate) {
            // optional: beri feedback (toast) kalau belum lengkap
            return;
        }
        router.get(route('absens.rekap'), { start_date: startDate, end_date: endDate });
    };

    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        router.get(route('absens.rekap')); // reload tanpa filter
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Absensi" />
            <div className="space-y-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Rekap Absensi</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div>
                            <Label>Dari Tanggal</Label>
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Sampai Tanggal</Label>
                            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="flex items-end space-x-2">
                            <Button onClick={applyDateFilter}>Terapkan</Button>
                            <Button variant="outline" onClick={resetFilters}>
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <Card className="text-center">
                        <CardHeader>
                            <CardTitle>Hadir</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">{totalHadir}</CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardHeader>
                            <CardTitle>Izin</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">{totalIzin}</CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardHeader>
                            <CardTitle>Cuti</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">{totalCuti}</CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Tabel Rekap Absensi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={data} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
