import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';

import { PurchaseRequest } from '@/types/purchaseRequest';
import { Head } from '@inertiajs/react';
import { Toaster } from 'sonner';
import { columns } from './table/column';
import { DataTable } from './table/data-table';

interface IndexProps {
    purchaseRequests: PurchaseRequest[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase Request',
        href: '/purchaseRequest',
    },
];

export default function Index({ purchaseRequests }: IndexProps) {
    const [data, setData] = useState<PurchaseRequest[]>([]);

    useEffect(() => {
        setData(purchaseRequests);
    }, [purchaseRequests]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase Request" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>

            <Toaster />
        </AppLayout>
    );
}
