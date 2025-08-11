import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Blokir } from '@/types/blokir';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/column';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blokir',
        href: '/blokirs',
    },
];

export default function BlokirPage({ blokirs }: { blokirs: Blokir[] }) {
    const [data, setData] = useState<Blokir[]>([]);

    useEffect(() => {
        setData(blokirs);
    }, [blokirs]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blokir" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} blokirs={blokirs} />
            </div>
        </AppLayout>
    );
}
