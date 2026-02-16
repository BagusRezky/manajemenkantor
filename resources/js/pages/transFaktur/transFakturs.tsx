import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { TransFaktur } from '@/types/transFaktur';
import { Head } from '@inertiajs/react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Faktur', href: route('transFakturs.index') }];

export default function Index({ fakturs }: { fakturs: TransFaktur[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Faktur" />
            <div className="p-6">
                <DataTable columns={columns()} data={fakturs} />
            </div>
        </AppLayout>
    );
}
