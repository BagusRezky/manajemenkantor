import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { PaymentEntryGood } from '@/types/paymentEntryGood';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PaymentEntryGood',
        href: '/paymentEntryGoods',
    },
];

export default function PaymentEntryGoodPage({ paymentEntryGoods }: { paymentEntryGoods: PaymentEntryGood[] }) {
    const [data, setData] = useState<PaymentEntryGood[]>([]);

    useEffect(() => {
        setData(paymentEntryGoods);
    }, [paymentEntryGoods]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PaymentEntryGood" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} paymentEntryGoods={paymentEntryGoods} />
            </div>
        </AppLayout>
    );
}
