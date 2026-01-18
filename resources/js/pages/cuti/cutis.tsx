import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Cuti } from '@/types/cuti';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Cuti', href: '/cutis' }];

export default function Cutis({ cutis }: { cutis: Cuti[] }) {
    const [data, setData] = useState<Cuti[]>([]);

    useEffect(() => {
        setData(cutis);
    }, [cutis]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Ganti title */}
            <Head title="Cuti" />

            <div className="mx-5 py-5">
                {/* Ganti props */}
                <DataTable columns={columns()} data={data} cutis={cutis} />
            </div>
        </AppLayout>
    );
}
