
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import { PurchaseOrder } from '@/types/purchaseOrder';



const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Purchase Order ini?')) {
        router.delete(`/purchaseOrders/${id}`, {
            onSuccess: () => {
                toast.success('Purchase Order berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Purchase Order');
            },
        });
    }
};

export const columns = (): ColumnDef<PurchaseOrder>[]=> [
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
        accessorKey: 'no_po',
        header: 'NO. PO',
    },
    {
        accessorKey: 'purchase_request.no_pr',
        header: 'No. PR',
    },
    {
        accessorKey: 'tanggal_po',
        header: 'Tanggal PO',
        cell: ({ row }) => {
            const purchaseOrder = row.original;
            return <span>{new Date(purchaseOrder.tanggal_po).toLocaleDateString() || purchaseOrder.tanggal_po || '-'}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const purchaseOrder = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(purchaseOrder.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />

                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
