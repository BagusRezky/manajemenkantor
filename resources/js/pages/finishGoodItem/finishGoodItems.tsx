import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

import { FinishGoodItem } from '@/types/finishGoodItem';
import { DataTable } from './table/data-table';
import { columns } from './table/column';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finish Good Items',
        href: '/finishGoodItems',
    },
];

interface IndexProps {
    finishGoodItems: FinishGoodItem[];
}

export default function Index({ finishGoodItems }: IndexProps) {
    const [data, setData] = useState<FinishGoodItem[]>([]);

    useEffect(() => {
        setData(finishGoodItems);
    }, [finishGoodItems]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Finish Good Item" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>
            <Toaster />
        </AppLayout>
    );
}
