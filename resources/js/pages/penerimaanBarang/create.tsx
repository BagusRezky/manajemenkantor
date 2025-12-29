import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PurchaseOrder } from '@/types/purchaseOrder';
import { Head } from '@inertiajs/react';
import { PenerimaanBarangForm } from './components/penerimaanBarangForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penerimaan Barang',
        href: '/penerimaanBarangs',
    },
    {
        title: 'Tambah Penerimaan Barang',
        href: '/penerimaanBarangs/create',
    },
];

interface CreateProps {
    purchaseOrders: PurchaseOrder[];
    previousReceipts: {
        id_purchase_order_item: string;
        total_qty_penerimaan: number;
    }[];
}

export default function Create({ purchaseOrders, previousReceipts }: CreateProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Penerimaan Barang" />
            <div className="mx-5 py-5">
                <PenerimaanBarangForm purchaseOrders={purchaseOrders} previousReceipts={previousReceipts} />
            </div>
        </AppLayout>
    );
}
