import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { TransPayment } from '@/types/transPayment';
import { Head } from '@inertiajs/react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pembayaran', href: route('transPayments.index') }];

export default function TransPayments({ payments }: { payments: TransPayment[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi Pembayaran" />
            <div className="p-6">
                <DataTable columns={columns()} data={payments} />
            </div>
        </AppLayout>
    );
}
