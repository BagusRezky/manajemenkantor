import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

import { Operator } from '@/types/operator';
import { Toaster } from 'sonner';
import EditMesinModal from './modal/edit-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mesins',
        href: '/operators',
    },
];

export default function Mesins({ operators }: { operators: Operator[] }) {
    const [data, setData] = useState<Operator[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);

    useEffect(() => {
        setData(operators);
    }, [operators]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mesins" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedOperator)} data={data} operators={operators} />
            </div>

            <EditMesinModal isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} operator={selectedOperator} />
            <Toaster />
        </AppLayout>
    );
}
