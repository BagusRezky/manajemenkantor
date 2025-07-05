import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { columns} from "./table/columns";
import { DataTable } from "./table/data-table";

import { Toaster } from "sonner";
import { MesinDiemaking } from "@/types/mesinDiemaking";
import EditMesinDiemakingModal from "./modal/edit-modal";




const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mesin Diemaking',
        href: '/mesinDiemakings',
    },
];

export default function MesinDiemakings({ mesinDiemakings }: { mesinDiemakings: MesinDiemaking[] }) {
    const [data, setData] = useState<MesinDiemaking[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedMesinDiemaking, setSelectedMesinDieMaking] = useState<MesinDiemaking | null>(null);

    useEffect(() => {
        setData(mesinDiemakings);
    }, [mesinDiemakings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mesin Diemaking" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedMesinDieMaking)} data={data} mesinDiemakings={mesinDiemakings} />
            </div>

            <EditMesinDiemakingModal isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} mesinDiemaking={selectedMesinDiemaking} />
            <Toaster />
        </AppLayout>
    );
}
