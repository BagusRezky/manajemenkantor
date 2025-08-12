import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { ReturInternal } from '@/types/returInternal';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retur Internal',
        href: '/returInternals',
    },
];

export default function ReturInternalPage({ returInternal }: { returInternal: ReturInternal[] }) {
    const [data, setData] = useState<ReturInternal[]>([]);

    useEffect(() => {
        setData(returInternal);
    }, [returInternal]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Retur Internal" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} returInternal={returInternal} />
            </div>
        </AppLayout>
    );
}
