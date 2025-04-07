import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { TypeOffice } from '@/types/typeOffice';


import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import EditTypeOfficeModal from './modal/edit-modal';
import { DataTable } from './table/data-table';
import { columns } from './table/columns';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Type Offices',
        href: '/typeOffices',
    },
];

export default function TypeOffices({ typeOffices }: { typeOffices: TypeOffice[] }) {
    const [data, setData] = useState<TypeOffice[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedTypeOffice, setSelectedTypeOffice] = useState<TypeOffice | null>(null);

    useEffect(() => {
        setData(typeOffices);
    }, [typeOffices]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Type Offices" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedTypeOffice)} data={data} typeOffices={typeOffices} />
            </div>

            <EditTypeOfficeModal isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} typeOffice={selectedTypeOffice} />
        </AppLayout>
    );
}
