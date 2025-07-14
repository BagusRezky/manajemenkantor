import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { DataTable } from './table/data-table';
import { ImrDiemaking } from '@/types/imrDiemaking';
import { columns } from './table/columns';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Internal Material Request',
        href: '/imrDiemakings',
    },
];

export default function InternalMaterialRequestPage({ imrDiemakings }: { imrDiemakings: ImrDiemaking[] }) {
    const [data, setData] = useState<ImrDiemaking[]>([]);

    useEffect(() => {
        setData(imrDiemakings);
    }, [imrDiemakings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Internal Material Request" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} imrDiemakings={imrDiemakings} />
            </div>
        </AppLayout>
    );
}
