// pages/hariLibur/hariLiburs.tsx

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { HariLibur } from '@/types/hariLibur';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Hari Libur', href: '/hariLiburs' }];

export default function HariLiburs({ hariLiburs }: { hariLiburs: HariLibur[] }) {
    const [data, setData] = useState<HariLibur[]>([]);

    useEffect(() => {
        setData(hariLiburs);
    }, [hariLiburs]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hari Libur" />

            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>
        </AppLayout>
    );
}
