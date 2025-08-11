import { BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import { CustomerAddress } from '@/types/customerAddress';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import EditCustomerAddressModal from './modal/edit-modal';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Addresses',
        href: '/customerAddresses',
    },
];

export default function CustomerAddresses({ customerAddresses }: { customerAddresses: CustomerAddress[] }) {
    const [data, setData] = useState<CustomerAddress[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedCustomerAddress, setSelectedCustomerAddress] = useState<CustomerAddress | null>(null);

    useEffect(() => {
        setData(customerAddresses);
    }, [customerAddresses]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer" />
            <div className="mx-5 py-5">
                <DataTable
                    columns={columns(() => {}, setEditModalOpen, setSelectedCustomerAddress)}
                    data={data}
                    customerAddresses={customerAddresses}
                />
            </div>

            <EditCustomerAddressModal isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} customerAddress={selectedCustomerAddress} />
        </AppLayout>
    );
}
