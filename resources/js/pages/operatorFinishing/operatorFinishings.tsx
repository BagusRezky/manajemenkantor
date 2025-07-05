import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

import { OperatorFinishing } from '@/types/operatorFinishing';
import { Toaster } from 'sonner';
import EditOperatorFinishingModal from './modal/edit-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Operator Finishing',
        href: '/operatorFinishings',
    },
];

export default function OperatorDiemkings({ operatorFinishings }: { operatorFinishings: OperatorFinishing[] }) {
    const [data, setData] = useState<OperatorFinishing[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedOperatorFinishing, setSelectedOperatorFinishing] = useState<OperatorFinishing | null>(null);

    useEffect(() => {
        setData(operatorFinishings);
    }, [operatorFinishings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Operator Diemaking" />
            <div className="mx-5 py-5">
                <DataTable
                    columns={columns(() => {}, setEditModalOpen, setSelectedOperatorFinishing)}
                    data={data}
                    operatorFinishings={operatorFinishings}
                />
            </div>

            <EditOperatorFinishingModal
                isOpen={editModelOpen}
                onClose={() => setEditModalOpen(false)}
                operatorFinishing={selectedOperatorFinishing}
            />
            <Toaster />
        </AppLayout>
    );
}
