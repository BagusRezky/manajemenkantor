import { Checkbox } from "@/components/ui/checkbox";
import { router } from "@inertiajs/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PurchaseRequest {
    id: string;
    no_pr: string;
    tgl_pr: string;
    departemen: {
        nama_departemen: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    purchaseRequestItems: any[];
}

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Purchase Request ini?')) {
        router.delete(`/purchaseRequest/${id}`, {
            onSuccess: () => {
                toast.success('Purchase Request berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Purchase Request');
            },
        });
    }
};

export const columns = (
    setSelectedItem: (item: PurchaseRequest | null) => void,
    openDetailModal: (item: PurchaseRequest) => void,
): ColumnDef<PurchaseRequest>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'no_pr',
        header: 'No. PR',
    },
    {
        accessorKey: 'departemen.nama_departemen',
        header: 'Departemen',
        cell: ({ row }) => row.original.departemen?.nama_departemen || '-',
    },
    {
        accessorKey: 'tgl_pr',
        header: 'Tanggal PR',
        cell: ({ row }) =>{
            const date = row.original.tgl_pr;
            if (!date) return '-';

            // Assuming date is in a compatible format
            try {
                const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format
                return formattedDate;
            } catch {
                return date; // Return original if formatting fails
            }
        },
    },
    // {
    //     accessorKey: 'total_items',
    //     header: 'Total Items',
    //     cell: ({ row }) => row.original.purchaseRequestItems?.length || 0,
    // },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/purchaseRequest/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDetailModal(item)}>Detail</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
