import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Gaji } from '@/types/gaji';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { DataTable } from './table/data-table';
import { columns } from './table/columns';

const breadcrumbs = [{ title: 'Rekap Gaji', href: route('gajis.index') }];

interface Props {
    rekap: Gaji[];
    bulan: string;
    tahun: string;
}

export default function Gajis({ rekap, bulan, tahun }: Props) {
    const [filter, setFilter] = useState({
        bulan,
        tahun,
    });

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('gajis.index'), filter, { preserveState: true });
    };

    const bulanList = [
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Gaji" />

            <Card>
                <CardHeader>
                    <CardTitle>Rekapitulasi Gaji Karyawan</CardTitle>
                </CardHeader>

                <CardContent>
                    {/* Filter Bulan & Tahun */}
                    <form onSubmit={handleFilter} className="mb-4 flex flex-wrap items-end gap-3">
                        <div>
                            <label className="text-sm font-medium">Bulan</label>
                            <select
                                value={filter.bulan}
                                onChange={(e) => setFilter({ ...filter, bulan: e.target.value })}
                                className="ml-2 rounded-md border p-2"
                            >
                                {bulanList.map((b) => (
                                    <option key={b.value} value={b.value}>
                                        {b.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Tahun</label>
                            <input
                                type="number"
                                className="ml-2 w-28 rounded-md border p-2"
                                value={filter.tahun}
                                onChange={(e) => setFilter({ ...filter, tahun: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="ml-2">
                            Tampilkan
                        </Button>
                    </form>

                    {/* Data Tabel */}
                    <DataTable columns={columns} data={rekap} />
                </CardContent>
            </Card>
        </AppLayout>
    );
}
