import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TransPayment } from '@/types/transPayment';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';

export const columns = (): ColumnDef<TransPayment>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
    },
    { accessorKey: 'no_pembayaran', header: 'No. Pembayaran' },
    {
        accessorKey: 'po_billing',
        header: 'Reff Billing',
        accessorFn: (row) => row.po_billing?.no_bukti_tagihan || '-',
    },
    { accessorKey: 'tanggal_header', header: 'Tanggal' },
    { accessorKey: 'gudang', header: 'Gudang' },
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
                    <DropdownMenuItem onClick={() => router.get(route('transPayments.show', row.original.id))}>
                        <Eye className="mr-2 h-4 w-4" /> Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.get(route('transPayments.edit', row.original.id))}>
                        <Edit className="mr-2 h-4 w-4" /> Updated
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                            if (confirm('Hapus transaksi pembayaran ini?')) {
                                router.delete(route('transPayments.destroy', row.original.id), {
                                    onSuccess: () => toast.success('Berhasil dihapus'),
                                });
                            }
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
