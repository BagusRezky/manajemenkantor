import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { MetodeBayar } from '@/types/metodeBayar';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Metode Bayar', href: route('metodeBayars.index') }];

export default function MetodeBayars({ metodeBayars }: { metodeBayars: MetodeBayar[] }) {
    const [data, setData] = useState<MetodeBayar[]>([]);

    useEffect(() => {
        setData(metodeBayars);
    }, [metodeBayars]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Metode Bayar" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>
        </AppLayout>
    );
}
