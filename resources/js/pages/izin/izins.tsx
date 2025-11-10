import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { Izin } from '@/types/izin';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Izin', href: '/izins' }];

export default function Izins({ izins }: { izins: Izin[] }) {
    const [data, setData] = useState<Izin[]>([]);

    useEffect(() => {
        setData(izins);
    }, [izins]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Izin" />

            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} izins={izins} />
            </div>
        </AppLayout>
    );
}
