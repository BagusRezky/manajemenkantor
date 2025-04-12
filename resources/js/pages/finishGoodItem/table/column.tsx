import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FinishGoodItem } from "@/types/finishGoodItem";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";


const handleDelete = (item: string) => {
    router.delete(`/finishGoodItems/${item}`, {
        onSuccess: () => {
            toast.success('Finish Good Item deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete Finish Good Item');
        },
    });
};

export const columns = (setSelectedItem: (item: FinishGoodItem | null) => void, openDetailModal: (item: FinishGoodItem) => void): ColumnDef<FinishGoodItem>[] => [
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
        accessorKey: 'kode_barcode',
        header: 'Kode Barang',
    },
    {
        accessorKey: 'kode_material_produk',
        header: 'Kode Material',

    },
    {
        accessorKey: 'nama_barang',
        header: 'Nama Barang',
    },
    // {
    //     accessorKey: 'category_item.nama_category_item',
    //     header: 'Kategori',
    //     cell: ({ row }) => row.original.category_item?.nama_category_item || '-',
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
                        <DropdownMenuItem onClick={() => router.get(`/finishGoodItems/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDetailModal(item)}>Detail</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
