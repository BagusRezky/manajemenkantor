import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { Invoice } from '@/types/invoice';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoice',
        href: '/invoices',
    },
];

export default function InvoicePage({ invoices }: { invoices: Invoice[] }) {
    const [data, setData] = useState<Invoice[]>([]);

    useEffect(() => {
        setData(invoices);
    }, [invoices]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoice" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} invoices={invoices} />
            </div>
        </AppLayout>
    );
}
