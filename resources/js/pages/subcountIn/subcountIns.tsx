import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SubcountIn } from '@/types/subcountIn';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subcount In',
        href: '/subcountIns',
    },
];

export default function SubcountInPage({ subcountIns }: { subcountIns: SubcountIn[] }) {
    const [data, setData] = useState<SubcountIn[]>([]);

    useEffect(() => {
        setData(subcountIns);
    }, [subcountIns]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subcount In" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} subcountIns={subcountIns} />
            </div>
        </AppLayout>
    );
}
