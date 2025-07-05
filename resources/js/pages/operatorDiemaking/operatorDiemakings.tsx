import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

import { OperatorDiemaking } from '@/types/operatorDiemaking';
import { Toaster } from 'sonner';
import EditOperatorDiemakingModal from './modal/edit-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Operator Diemaking',
        href: '/operatorDiemakings',
    },
];

export default function OperatorDiemkings({ operatorDiemakings }: { operatorDiemakings: OperatorDiemaking[] }) {
    const [data, setData] = useState<OperatorDiemaking[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedOperatorDiemaking, setSelectedOperatorDiemaking] = useState<OperatorDiemaking | null>(null);

    useEffect(() => {
        setData(operatorDiemakings);
    }, [operatorDiemakings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Operator Diemaking" />
            <div className="mx-5 py-5">
                <DataTable
                    columns={columns(() => {}, setEditModalOpen, setSelectedOperatorDiemaking)}
                    data={data}
                    operatorDiemakings={operatorDiemakings}
                />
            </div>

            <EditOperatorDiemakingModal
                isOpen={editModelOpen}
                onClose={() => setEditModalOpen(false)}
                operatorDiemaking={selectedOperatorDiemaking}
            />
            <Toaster />
        </AppLayout>
    );
}
