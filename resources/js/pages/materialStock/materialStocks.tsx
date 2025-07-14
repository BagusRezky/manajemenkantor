import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { MaterialStock } from '@/types/materialStock';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { DataTable } from './table/data-table';
import { columns } from './table/column';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material Stock',
        href: '/materialStocks',
    },
];

export default function MaterialStockPage({ materialStocks }: { materialStocks: MaterialStock[] }) {
    const [data, setData] = useState<MaterialStock[]>([]);

    useEffect(() => {
        setData(materialStocks);
    }, [materialStocks]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Material Stock" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} materialStocks={materialStocks} />
            </div>
        </AppLayout>
    );
}
