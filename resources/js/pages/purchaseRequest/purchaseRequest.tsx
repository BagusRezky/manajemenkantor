import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { useState, useEffect } from "react";

import { Toaster } from "sonner";
import { columns } from "./table/column";
import { DataTable } from "./table/data-table";
import { Head } from "@inertiajs/react";
import DetailModal from "./modal/detail-modal";

interface PurchaseRequest {
    id: string;
    no_pr: string;
    tgl_pr: string;
    departemen: {
        nama_departemen: string;
    };
    purchaseRequestItems: PurchaseRequestItem[];
}

interface PurchaseRequestItem {
    id: string;
    qty: number;
    eta: string;
    catatan: string;
    masterItem: {
        kode_master_item: string;
        typeItem: {
            nama_type_item: string;
        };
        unit: {
            nama_satuan: string;
        };
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemReferences: any; // Add the missing property to match the definition in detail-modal.tsx
}

interface IndexProps {
    purchaseRequests: PurchaseRequest[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase Request',
        href: '/purchaseRequest',
    },
];

export default function Index({ purchaseRequests }: IndexProps) {
    const [data, setData] = useState<PurchaseRequest[]>([]);
    const [selectedItem, setSelectedItem] = useState<PurchaseRequest | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {
        setData(purchaseRequests);
    }, [purchaseRequests]);

    const openDetailModal = (item: PurchaseRequest) => {
        setSelectedItem(item);
        setDetailModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase Request" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(setSelectedItem, openDetailModal)} data={data} />
            </div>

            <DetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} item={selectedItem} />
            <Toaster />
        </AppLayout>
    );
}
