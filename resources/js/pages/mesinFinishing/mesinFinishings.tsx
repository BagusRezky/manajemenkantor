import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

import { MesinFinishing } from '@/types/mesinFinishing';
import { Toaster } from 'sonner';
import EditMesinFinishingModal from './modal/edit-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mesin Finishing',
        href: '/mesinFinishings',
    },
];

export default function MesinFinishings({ mesinFinishings }: { mesinFinishings: MesinFinishing[] }) {
    const [data, setData] = useState<MesinFinishing[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedMesinFinishing, setSelectedMesinFinishing] = useState<MesinFinishing | null>(null);

    useEffect(() => {
        setData(mesinFinishings);
    }, [mesinFinishings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mesin Finishing" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedMesinFinishing)} data={data} mesinFinishings={mesinFinishings} />
            </div>

            <EditMesinFinishingModal isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} mesinFinishing={selectedMesinFinishing} />
            <Toaster />
        </AppLayout>
    );
}
