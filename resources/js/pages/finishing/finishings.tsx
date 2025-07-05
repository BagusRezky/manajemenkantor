import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Finishing } from '@/types/finishing';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finishing',
        href: '/finishings',
    },
];

export default function FinishingPage({ finishings }: { finishings: Finishing[] }) {
    const [data, setData] = useState<Finishing[]>([]);

    useEffect(() => {
        setData(finishings);
    }, [finishings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Finishing" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} finishings={finishings} />
            </div>
        </AppLayout>
    );
}
