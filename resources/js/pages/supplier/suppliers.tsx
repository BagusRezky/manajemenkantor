import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns, Supplier } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Suppliers',
        href: '/suppliers',
    },
];

export default function Suppliers({ suppliers }: { suppliers: Supplier[] }) {
    const [data, setData] = useState<Supplier[]>([]);

    useEffect(() => {
        setData(suppliers);
    }, [suppliers]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suppliers" />

            <div className="mx-5 py-5">
                <DataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
}
