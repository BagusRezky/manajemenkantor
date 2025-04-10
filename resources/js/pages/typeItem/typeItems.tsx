import AppLayout from "@/layouts/app-layout";
import EditTypeItemModal from "./modal/edit-modal";
import { Head } from "@inertiajs/react";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import { useEffect, useState } from "react";
import { BreadcrumbItem } from "@/types";
import { TypeItem } from "@/types/typeItem";
import { CategoryItem } from "@/types/categoryItem";
import { Toaster } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Type Items',
        href: '/typeItems',
    },
];

interface TypeItemsProps {
    typeItems: TypeItem[];
    categoryItems: CategoryItem[];
}

export default function TypeItems({ typeItems, categoryItems }: TypeItemsProps) {
    const [data, setData] = useState<TypeItem[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedTypeItem, setSelectedTypeItem] = useState<TypeItem | null>(null);

    useEffect(() => {
        setData(typeItems);
    }, [typeItems]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Type Items" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedTypeItem)} data={data} categoryItems={categoryItems}   />
            </div>

            <EditTypeItemModal isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} typeItem={selectedTypeItem} categoryItems={categoryItems} />
            <Toaster/>
        </AppLayout>
    );
}
