import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PoBilling } from '@/types/poBilling';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Purchase Order Billing', href: route('poBillings.index') },
];

export default function PoBillings({ billings }: { billings: PoBilling[] }) {
    const [data, setData] = useState<PoBilling[]>([]);

    useEffect(() => {
        setData(billings);
    }, [billings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PO Billing" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>
            <Toaster position="top-right" richColors />
        </AppLayout>
    );
}
