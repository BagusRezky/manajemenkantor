import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SuratJalan } from '@/types/suratJalan';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Surat Jalan',
        href: '/suratJalans',
    },
];

export default function SuratJalanPage({ suratJalans }: { suratJalans: SuratJalan[] }) {
    const [data, setData] = useState<SuratJalan[]>([]);

    useEffect(() => {
        setData(suratJalans);
    }, [suratJalans]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Surat Jalan" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} suratJalans={suratJalans} />
            </div>
        </AppLayout>
    );
}
