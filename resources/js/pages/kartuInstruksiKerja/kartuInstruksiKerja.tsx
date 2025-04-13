import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { DataTable } from './table/data-table';
import { columns } from './table/column';
import { DetailModal } from './modal/detail-modal';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kartu Instruksi Kerja',
        href: '/kartuInstruksiKerja',
    },
];

interface IndexProps {
    kartuInstruksiKerja: KartuInstruksiKerja[];
}

export default function Index({ kartuInstruksiKerja }: IndexProps) {
    const [data, setData] = useState<KartuInstruksiKerja[]>([]);
    const [selectedItem, setSelectedItem] = useState<KartuInstruksiKerja | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {
        setData(kartuInstruksiKerja);
    }, [kartuInstruksiKerja]);

    const openDetailModal = (item: KartuInstruksiKerja) => {
        setSelectedItem(item);
        setDetailModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kartu Instruksi Kerja" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(setSelectedItem, openDetailModal)} data={data} />
            </div>
            <DetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} item={selectedItem} />
            <Toaster />
        </AppLayout>
    );
}
