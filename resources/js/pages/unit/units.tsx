import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { columns} from "./table/columns";
import { DataTable } from "./table/data-table";
import EditUnitModal from "./modal/edit-modal";
import { Unit } from "@/types/unit";

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
        </AppLayout>
    );
}
