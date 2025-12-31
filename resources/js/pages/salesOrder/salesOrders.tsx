import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SalesOrder } from '@/types/salesOrder';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { DetailModal } from './modal/detail-modal';
import { columns } from './table/column';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales Order',
        href: '/salesOrders',
    },
];

interface IndexProps {
    salesOrders: SalesOrder[];
}

export default function Index({ salesOrders }: IndexProps) {
    const [data, setData] = useState<SalesOrder[]>([]);
    const [selectedItem, setSelectedItem] = useState<SalesOrder | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {
        setData(salesOrders);
    }, [salesOrders]);

    const openDetailModal = (item: SalesOrder) => {
        setSelectedItem(item);
        setDetailModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales Order" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(setSelectedItem, openDetailModal)} data={data} />
            </div>
            <DetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} item={selectedItem} />
            <Toaster />
        </AppLayout>
    );
}
