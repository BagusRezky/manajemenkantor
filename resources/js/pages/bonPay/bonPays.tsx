import AppLayout from '@/layouts/app-layout';
import { BonPay } from '@/types/bonPay';
import { Head } from '@inertiajs/react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

interface Props {
    bonPays: BonPay[];
}

export default function Index({ bonPays }: Props) {
    const breadcrumbs = [{ title: 'Inv. Payment', href: '/bonPays' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Pembayaran (Inv. Payment)" />
            <div className="p-6">
                <DataTable columns={columns} data={bonPays} />
            </div>
        </AppLayout>
    );
}
