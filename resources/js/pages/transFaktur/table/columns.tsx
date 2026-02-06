import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TransFaktur } from '@/types/transFaktur';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, FileEdit, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';

export const columns = (): ColumnDef<TransFaktur>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
    },
    { accessorKey: 'no_faktur', header: 'No. Faktur' },
    { accessorKey: 'no_invoice', header: 'No. Invoice' },
    { accessorKey: 'tanggal_transaksi', header: 'Tanggal' },
    {
        accessorKey: 'grand_total',
        header: 'Total Faktur',
        cell: ({ row }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.original.grand_total),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const item = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.get(route('transFakturs.show', item.id))}>
                            <Eye className="mr-2 h-4 w-4" /> Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(route('transFakturs.edit', item.id))}>
                            <FileEdit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                                if (confirm('Hapus faktur ini?')) {
                                    router.delete(route('transFakturs.destroy', item.id), {
                                        onSuccess: () => toast.success('Faktur berhasil dihapus'),
                                    });
                                }
                            }}
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
