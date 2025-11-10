// pages/bonusKaryawan/bonusKaryawans.tsx

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { BonusKaryawan } from '@/types/bonusKaryawan';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Bonus Karyawan', href: '/bonusKaryawans' }];

export default function BonusKaryawans({ bonusKaryawans }: { bonusKaryawans: BonusKaryawan[] }) {
    const [data, setData] = useState<BonusKaryawan[]>([]);

    useEffect(() => {
        setData(bonusKaryawans);
    }, [bonusKaryawans]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bonus Karyawan" />

            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>
        </AppLayout>
    );
}
