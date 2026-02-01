import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TransKasBank } from '@/types/transKasBank';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDownLeft, ArrowUpRight, Edit, MoreHorizontal, Trash } from 'lucide-react';

export const columns = (): ColumnDef<TransKasBank>[] => [
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
    {
        accessorKey: 'transaksi',
        header: 'Tipe',
        cell: ({ row }) => {
            const isMasuk = row.original.transaksi === 21;
            return (
                <div className={`flex items-center gap-2 font-medium ${isMasuk ? 'text-blue-600' : 'text-orange-600'}`}>
                    {isMasuk ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    {isMasuk ? 'Bank Masuk' : 'Bank Keluar'}
                </div>
            );
        },
    },
    { accessorKey: 'no_bukti', header: 'No. Bukti' },
    {
        accessorKey: 'account_bank',
        header: 'Akun Bank',
        accessorFn: (row) => row.account_bank?.nama_akun,
    },
    {
        accessorKey: 'nominal',
        header: 'Nominal',
        cell: ({ row }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.original.nominal),
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
                    <DropdownMenuItem onClick={() => router.get(route('trans-kas-banks.show', row.original.id))}>
                        <Edit className="mr-2 h-4 w-4" /> Detail
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.get(route('trans-kas-banks.edit', row.original.id))}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => router.delete(route('trans-kas-banks.destroy', row.original.id))}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
