import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { DataTable } from './table/data-table';
import { columns } from './table/columns';
import { ImrFinishing } from '@/types/imrFinishing';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Internal Material Request',
        href: '/imrFinishings',
    },
];

export default function InternalMaterialRequestPage({ imrFinishings }: { imrFinishings: ImrFinishing[] }) {
    const [data, setData] = useState<ImrFinishing[]>([]);

    useEffect(() => {
        setData(imrFinishings);
    }, [imrFinishings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Internal Material Request" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} imrFinishings={imrFinishings} />
            </div>
        </AppLayout>
    );
}
