import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Unit } from '@/types/unit';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import EditUnitModal from './modal/edit-modal';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Units',
        href: '/units',
    },
];

export default function Units({ units }: { units: Unit[] }) {
    const [data, setData] = useState<Unit[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    useEffect(() => {
        setData(units);
    }, [units]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Units" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedUnit)} data={data} units={units} />
            </div>

            <EditUnitModal isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} unit={selectedUnit} />
            <Toaster />
        </AppLayout>
    );
}
