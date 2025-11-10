// pages/potonganTunjangan/potonganTunjangans.tsx

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { PotonganTunjangan } from '@/types/potonganTunjangan';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Potongan Tunjangan', href: '/potonganTunjangans' }];

export default function PotonganTunjangans({ potonganTunjangans }: { potonganTunjangans: PotonganTunjangan[] }) {
    const [data, setData] = useState<PotonganTunjangan[]>([]);

    useEffect(() => {
        setData(potonganTunjangans);
    }, [potonganTunjangans]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Potongan Tunjangan" />

            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>
        </AppLayout>
    );
}
