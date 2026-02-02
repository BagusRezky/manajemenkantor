import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Absen } from '@/types/absen';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Absen', href: '/absens' }];

export default function Absens({ absens }: { absens: Absen[] }) {
    const [data, setData] = useState<Absen[]>([]);

    useEffect(() => {
        setData(absens);
    }, [absens]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Absen" />

            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} absens={absens} />
            </div>
        </AppLayout>
    );
}
