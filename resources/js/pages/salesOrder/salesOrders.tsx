import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SalesOrder } from '@/types/salesOrder';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

import { columns } from './table/column';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales Order',
        href: '/salesOrders',
    },
];

interface IndexProps {
    salesOrders: SalesOrder[];
}

export default function Index({ salesOrders }: IndexProps) {
    const [data, setData] = useState<SalesOrder[]>([]);

    useEffect(() => {
        setData(salesOrders);
    }, [salesOrders]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales Order" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>

            <Toaster />
        </AppLayout>
    );
}
