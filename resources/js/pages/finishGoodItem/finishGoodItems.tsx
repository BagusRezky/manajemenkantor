import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

import { FinishGoodItem } from '@/types/finishGoodItem';
import { DataTable } from './table/data-table';
import { columns } from './table/column';
import { DetailModal } from './modal/detail-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finish Good Items',
        href: '/finishGoodItems',
    },
];

interface IndexProps {
    finishGoodItems: FinishGoodItem[];
}

export default function Index({ finishGoodItems }: IndexProps) {
    const [data, setData] = useState<FinishGoodItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<FinishGoodItem | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {
        setData(finishGoodItems);
    }, [finishGoodItems]);

    const openDetailModal = (item: FinishGoodItem) => {
        setSelectedItem(item);
        setDetailModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Items" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(setSelectedItem, openDetailModal)} data={data} />
            </div>
            <DetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} item={selectedItem} />
            <Toaster />
        </AppLayout>
    );
}
