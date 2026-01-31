import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MasterCoa } from '@/types/masterCoa';


import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

export const columns = (): ColumnDef<MasterCoa>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
    },
    { accessorKey: 'kode_akuntansi', header: 'Kode Akun' },
    { accessorKey: 'nama_akun', header: 'Nama Akun' },
    {
        accessorKey: 'master_coa_class',
        header: 'Class',
        accessorFn: (row) => row.master_coa_class?.name,
    },
    {
        accessorKey: 'saldo_debit',
        header: 'Debit',
        cell: ({ row }) => formatCurrency(row.original.saldo_debit),
    },
    {
        accessorKey: 'saldo_kredit',
        header: 'Kredit',
        cell: ({ row }) => formatCurrency(row.original.saldo_kredit),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge variant={row.original.status ? 'default' : 'destructive'}>{row.original.status ? 'Active' : 'Inactive'}</Badge>,
    },
    {
        header: 'Aksi',
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
                        <DropdownMenuItem onClick={() => router.get(route('masterCoas.edit', item.id))}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => router.delete(route('masterCoas.destroy', item.id))}>
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(route('masterCoas.show', item.id))}>Detail</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
