import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { InternalMaterialRequest } from '@/types/internalMaterialRequest';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { columns } from './table/column';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Internal Material Request',
        href: '/internalMaterialRequests',
    },
];

export default function InternalMaterialRequestPage({ internalMaterialRequests }: { internalMaterialRequests: InternalMaterialRequest[] }) {
    const [data, setData] = useState<InternalMaterialRequest[]>([]);

    useEffect(() => {
        setData(internalMaterialRequests);
    }, [internalMaterialRequests]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Internal Material Request" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} internalMaterialRequests={internalMaterialRequests} />
            </div>
        </AppLayout>
    );
}
