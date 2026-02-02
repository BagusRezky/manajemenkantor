import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { OperasionalPay } from '@/types/operasionalPay';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Operasional Pay', href: route('operasionalPays.index') }];

export default function OperasionalPays({ operasionalPays }: { operasionalPays: OperasionalPay[] }) {
    const [data, setData] = useState<OperasionalPay[]>([]);

    useEffect(() => {
        setData(operasionalPays);
    }, [operasionalPays]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Operasional Pay" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>
        </AppLayout>
    );
}
