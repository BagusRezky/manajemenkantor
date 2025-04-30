import { BreadcrumbItem } from "@/types";

import { useEffect, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";

import { PurchaseOrder } from "@/types/purchaseOrder";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase Orders',
        href: '/purchaseOrders',
    },
];

export default function PurchaseOrders({ purchaseOrders }: { purchaseOrders: PurchaseOrder[] }) {
    const [data, setData] = useState<PurchaseOrder[]>([]);

    useEffect(() => {
        setData(purchaseOrders);
    }, [purchaseOrders]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase Order" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} purchaseOrders={purchaseOrders} />
            </div>
        </AppLayout>
    );
}
