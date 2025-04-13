import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FinishGoodItem } from '@/types/finishGoodItem';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { DataTable } from './table/trashed-data-table';
import { trashedColumns } from './table/trashed-column';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finish Good Items',
        href: '/finishGoodItems',
    },
    {
        title: 'Archived Items',
        href: '/finishGoodItems/cut-off',
    },
];

interface CutOffsProps {
    cutOff: FinishGoodItem[];
}

export default function CutOffs({ cutOff }: CutOffsProps) {
    const [data, setData] = useState<FinishGoodItem[]>([]);

    useEffect(() => {
        setData(cutOff);
    }, [cutOff]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archived Items" />
            <div className="mx-5 py-5">
                <DataTable columns={trashedColumns()} data={data} />
            </div>
            <Toaster />
        </AppLayout>
    );
}
