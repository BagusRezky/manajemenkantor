import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SubcountIn } from '@/types/subcountIn';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Subcount In ini?')) {
        router.delete(`/subcountIns/${id}`, {
            onSuccess: () => {
                toast.success('Subcount In berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Subcount In');
            },
        });
    }
};

export const columns = (): ColumnDef<SubcountIn>[] => [
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
        accessorKey: 'no_subcount_in',
        header: 'No. Subcount In',
    },
    {
        accessorKey: 'tgl_subcount_in',
        header: 'Tanggal',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{format(new Date(data.tgl_subcount_in), 'dd-MM-yyyy')}</span>;
        },
    },
    {
        accessorKey: 'no_surat_jalan_pengiriman',
        header: 'No. Surat Jalan',
    },
    {
        accessorKey: 'admin_produksi',
        header: 'Admin Produksi',
    },
    {
        accessorKey: 'supervisor',
        header: 'Supervisor',
    },
    {
        accessorKey: 'admin_mainstore',
        header: 'Admin Mainstore',
    },
    {
        id: 'total_items',
        header: 'Total Items',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.subcount_in_items?.length || 0} items</span>;
        },
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
                        <DropdownMenuItem onClick={() => router.get(`/subcountIns/${item.id}`)}>Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/subcountIns/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
