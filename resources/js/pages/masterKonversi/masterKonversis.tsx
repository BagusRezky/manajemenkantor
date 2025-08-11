import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { MasterKonversi } from '@/types/masterKonversi';
import { TypeItem } from '@/types/typeItem';
import { Unit } from '@/types/unit';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { Toaster } from 'sonner';
import EditMasterKonversiModal from './modal/edit-modal';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Konversi',
        href: '/masterKonversis',
    },
];

interface MasterKonversiProps {
    konversiList: MasterKonversi[];
    typeItems: TypeItem[];
    units: Unit[];
}

export default function MasterKonversis({ konversiList, typeItems, units }: MasterKonversiProps) {
    const [data, setData] = useState<MasterKonversi[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedMasterKonversi, setSelectedMasterKonversi] = useState<MasterKonversi | null>(null);

    useEffect(() => {
        setData(konversiList);
    }, [konversiList]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedMasterKonversi)} data={data} typeItems={typeItems} units={units} />
            </div>

            <EditMasterKonversiModal
                isOpen={editModelOpen}
                onClose={() => setEditModalOpen(false)}
                masterKonversi={selectedMasterKonversi}
                typeItems={typeItems}
                units={units}
            />
            <Toaster />
        </AppLayout>
    );
}
