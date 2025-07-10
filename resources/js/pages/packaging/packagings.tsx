import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Packaging } from '@/types/packaging';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Packaging',
        href: '/packagings',
    },
];

export default function PackagingPage({ packagings }: { packagings: Packaging[] }) {
    const [data, setData] = useState<Packaging[]>([]);

    useEffect(() => {
        setData(packagings);
    }, [packagings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Packaging" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} packagings={packagings} />
            </div>
        </AppLayout>
    );
}
