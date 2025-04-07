import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import EditSupplierModal from './modal/edit-modal';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { Supplier } from '@/types/supplier';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Suppliers',
        href: '/suppliers',
    },
];

export default function Suppliers({ suppliers }: { suppliers: Supplier[] }) {
    const [data, setData] = useState<Supplier[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    useEffect(() => {
        setData(suppliers);
    }, [suppliers]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suppliers" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedSupplier)} data={data} suppliers={suppliers} />
            </div>

            <EditSupplierModal isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} supplier={selectedSupplier} />
        </AppLayout>
    );
}
