import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SalesOrder } from "@/types/salesOrder";

import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";


const handleDelete = (item: string) => {
    router.delete(`/salesOrders/${item}`, {
        onSuccess: () => {
            toast.success('Sales Order deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete Sales Order');
        },
    });
};

export const columns = (setSelectedItem: (item: SalesOrder | null) => void, openDetailModal: (item: SalesOrder) => void): ColumnDef<SalesOrder>[] => [
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
        accessorKey: 'no_bon_pesanan',
        header: 'No. Bon Pesanan',
    },
    {
        accessorKey: 'customer_address.nama_customer',
        header: 'Customer',
        cell: ({ row }) => row.original.customer_address?.nama_customer || '-',
    },
    {
        accessorKey: 'id_finish_good_item.kode_material_produk',
        header: 'Kode Material',
        cell: ({ row }) => row.original.finish_good_item?.kode_material_produk || '-',
    },
    {
        accessorKey: 'id_finish_good_item.nama_barang',
        header: 'Nama Produk',
        cell: ({ row }) => row.original.finish_good_item?.nama_barang || '-',
    },
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
                        {/* <DropdownMenuItem onClick={() => router.get(`/salesOrders/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => openDetailModal(item)}>Detail</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
