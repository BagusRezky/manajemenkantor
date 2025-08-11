import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { MasterItem } from '@/types/masterItem';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { DetailModal } from './modal/detail-modal';
import { columns } from './table/column';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Items',
        href: '/master-items',
    },
];

interface IndexProps {
    masterItems: MasterItem[];
}

export default function Index({ masterItems }: IndexProps) {
    const [data, setData] = useState<MasterItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MasterItem | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {
        setData(masterItems);
    }, [masterItems]);

    const openDetailModal = (item: MasterItem) => {
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
