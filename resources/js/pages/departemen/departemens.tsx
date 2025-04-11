import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Departemen } from '@/types/departemen';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { DataTable } from './table/data-table';
import { columns } from './table/columns';
import EditDepartemenModal from './modal/edit-modal';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departemens',
        href: '/departemens',
    },
];

export default function Departemens({ departemens }: { departemens: Departemen[] }) {
    const [data, setData] = useState<Departemen[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedDepartemen, setSelectedDepartemen] = useState<Departemen | null>(null);

    useEffect(() => {
        setData(departemens);
    }, [departemens]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Category Item" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedDepartemen)} data={data} departemens={departemens} />
            </div>

            <EditDepartemenModal isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} departemen={selectedDepartemen} />
        </AppLayout>
    );
}
