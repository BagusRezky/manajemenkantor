import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { columns } from './table/column';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Surat Perintah Kerja',
        href: '/kartuInstruksiKerja',
    },
];

interface IndexProps {
    kartuInstruksiKerja: KartuInstruksiKerja[];
}

export default function Index({ kartuInstruksiKerja }: IndexProps) {
    const [data, setData] = useState<KartuInstruksiKerja[]>([]);

    useEffect(() => {
        setData(kartuInstruksiKerja);
    }, [kartuInstruksiKerja]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Surat Perintah Kerja" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>

            <Toaster />
        </AppLayout>
    );
}
