import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { Lembur } from '@/types/lembur';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Lembur', href: '/lemburs' }];

export default function Lemburs({ lemburs }: { lemburs: Lembur[] }) {
    const [data, setData] = useState<Lembur[]>([]);

    useEffect(() => {
        setData(lemburs);
    }, [lemburs]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lembur" />

            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} lemburs={lemburs} />
            </div>
        </AppLayout>
    );
}
