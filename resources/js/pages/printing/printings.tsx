import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Printing } from '@/types/printing';

import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Printing',
        href: '/printings',
    },
];

export default function PrintingPage({ printings }: { printings: Printing[] }) {
    const [data, setData] = useState<Printing[]>([]);

    useEffect(() => {
        setData(printings);
    }, [printings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Printing" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} printings={printings} />
            </div>
        </AppLayout>
    );
}
