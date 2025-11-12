import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CutiTahunan } from '@/types/cuti';
import { Head } from '@inertiajs/react';
import { columns } from './table/cuti-tahunan/columns';
import { DataTable } from './table/cuti-tahunan/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cuti', href: route('cutis.index') },
    { title: 'Cuti Tahunan', href: route('cutiTahunan.index') },
];

interface CutiTahunanPageProps {
    cutiPerKaryawan: CutiTahunan[];
    totalHariLibur: number;
}

export default function CutiTahunanPage({ cutiPerKaryawan, totalHariLibur }: CutiTahunanPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cuti Tahunan" />

            <div className="space-y-6 p-8">
                <div>
                    <h1 className="mb-2 text-2xl font-bold">Rekap Cuti Tahunan</h1>
                    <p className="text-sm text-gray-600">
                        Total hari libur tahun ini: <span className="font-semibold">{totalHariLibur}</span>
                    </p>
                </div>

                <DataTable columns={columns} data={cutiPerKaryawan} />
            </div>
        </AppLayout>
    );
}
