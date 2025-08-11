import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { ReturEksternal } from '@/types/externalReturn';
import { columns } from './table/column';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retur Eksternal',
        href: '/returEksternals',
    },
];

export default function ReturEksternalPage({ returEksternal }: { returEksternal: ReturEksternal[] }) {
    const [data, setData] = useState<ReturEksternal[]>([]);

    useEffect(() => {
        setData(returEksternal);
    }, [returEksternal]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Retur Eksternal" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} returEksternal={returEksternal} />
            </div>
        </AppLayout>
    );
}
