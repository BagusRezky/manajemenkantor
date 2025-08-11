import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

import { Mesin } from '@/types/mesin';
import { Toaster } from 'sonner';
import EditMesinModal from './modal/edit-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mesins',
        href: '/mesins',
    },
];

export default function Mesins({ mesins }: { mesins: Mesin[] }) {
    const [data, setData] = useState<Mesin[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedMesin, setSelectedMesin] = useState<Mesin | null>(null);

    useEffect(() => {
        setData(mesins);
    }, [mesins]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mesins" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedMesin)} data={data} mesins={mesins} />
            </div>

            <EditMesinModal isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} mesin={selectedMesin} />
            <Toaster />
        </AppLayout>
    );
}
