import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SubcountOut } from '@/types/subcountOut';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subcount Out',
        href: '/subcountOuts',
    },
];

export default function SubcountOutPage({ subcountOuts }: { subcountOuts: SubcountOut[] }) {
    const [data, setData] = useState<SubcountOut[]>([]);

    useEffect(() => {
        setData(subcountOuts);
    }, [subcountOuts]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subcount Out" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} subcountOuts={subcountOuts} />
            </div>
        </AppLayout>
    );
}
