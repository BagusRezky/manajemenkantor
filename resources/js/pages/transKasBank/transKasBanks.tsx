import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { Head } from '@inertiajs/react';
import { columns } from './table/columns';

import { Toaster } from 'sonner';
import { TransKasBank } from '@/types/transKasBank';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Transaksi Kas', href: route('trans-kas-banks.index') }];

export default function TransKasIndex({ transKasBanks }: { transKasBanks: TransKasBank[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi Kas Bank" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={transKasBanks} />
            </div>
            <Toaster />
        </AppLayout>
    );
}
