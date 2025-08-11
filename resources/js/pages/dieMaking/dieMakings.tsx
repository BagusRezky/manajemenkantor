import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DieMaking } from '@/types/dieMaking';

import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Die Making',
        href: '/dieMakings',
    },
];

export default function DieMakingPage({ dieMakings }: { dieMakings: DieMaking[] }) {
    const [data, setData] = useState<DieMaking[]>([]);

    useEffect(() => {
        setData(dieMakings);
    }, [dieMakings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Die Making" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} dieMakings={dieMakings} />
            </div>
        </AppLayout>
    );
}
