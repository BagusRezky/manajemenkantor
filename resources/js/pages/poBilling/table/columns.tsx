import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PoBilling } from '@/types/poBilling';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';

export const columns = (): ColumnDef<PoBilling>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
    },
    { accessorKey: 'no_bukti_tagihan', header: 'No. Tagihan' },
    { accessorKey: 'gudang', header: 'Gudang' },
    { accessorKey: 'tanggal_transaksi', header: 'Tanggal' },
    {
        accessorKey: 'id_purchase_order',
        header: 'PO Reff',
        accessorFn: (row) => row.purchase_order?.no_po || '-',
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.get(route('poBillings.show', row.original.id))}>
                        <Eye className="mr-2 h-4 w-4" /> Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.get(route('poBillings.edit', row.original.id))}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => router.delete(route('poBillings.destroy', row.original.id))}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
