import { BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { DataTable } from './table/data-table';
import { ErorProduction } from '@/types/erorProduction';
import { columns } from './table/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Eror Production',
        href: '/erorProductions',
    },
];

export default function ErorProductions({ erorProductions }: { erorProductions: ErorProduction[] }) {
    const [data, setData] = useState<ErorProduction[]>([]);

    useEffect(() => {
        setData(erorProductions);
    }, [erorProductions]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Eror Production" />
            <div className="mx-5 py-5">
               <DataTable columns={columns()} data={data}  />
            </div>

        </AppLayout>
    );
}
