import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { TransKas } from '@/types/transKas';
import { Head } from '@inertiajs/react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Transaksi Kas', href: route('trans-kas.index') }];

export default function TransKasIndex({ transKas }: { transKas: TransKas[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi Kas" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={transKas} />
            </div>
        </AppLayout>
    );
}
