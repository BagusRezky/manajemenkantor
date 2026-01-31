import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { MasterCoa } from '@/types/masterCoa';
import { Head } from '@inertiajs/react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Master COA', href: route('masterCoas.index') }];

export default function MasterCoasIndex({ masterCoas }: { masterCoas: MasterCoa[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master COA" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={masterCoas} />
            </div>
            <Toaster />
        </AppLayout>
    );
}
