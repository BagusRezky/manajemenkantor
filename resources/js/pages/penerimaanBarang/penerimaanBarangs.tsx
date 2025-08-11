import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PenerimaanBarang } from '@/types/penerimaanBarang';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penerimaan Barang',
        href: '/penerimaanBarangs',
    },
];

export default function PenerimaanBarangPage({ penerimaanBarang }: { penerimaanBarang: PenerimaanBarang[] }) {
    const [data, setData] = useState<PenerimaanBarang[]>([]);

    useEffect(() => {
        setData(penerimaanBarang);
    }, [penerimaanBarang]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Penerimaan Barang" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} penerimaanBarang={penerimaanBarang} />
            </div>
        </AppLayout>
    );
}
