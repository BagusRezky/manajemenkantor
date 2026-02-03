import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { OperasionalPay } from '@/types/operasionalPay';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';

export const columns = (): ColumnDef<OperasionalPay>[] => [
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
    { accessorKey: 'no_bukti', header: 'No. Bukti' },

    {
        accessorKey: 'account_kas',
        header: 'Akun Kas',
        accessorFn: (row) => row.account_kas?.kode_akuntansi + ' - ' + row.account_kas?.nama_akun,
    },
    {
        accessorKey: 'account_beban',
        header: 'Akun Beban',
        accessorFn: (row) => row.account_beban?.kode_akuntansi + ' - ' + row.account_beban?.nama_akun,
    },
    {
        accessorKey: 'nominal',
        header: 'Nominal',
        cell: ({ row }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.original.nominal),
    },
    {
        accessorKey: 'tanggal_transaksi',
        header: 'Tanggal Transaksi',

    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.get(route('operasionalPays.show', row.original.id))}>
                        <Eye className="mr-2 h-4 w-4" /> Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.get(route('operasionalPays.edit', row.original.id))}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                            if (confirm('Hapus data operasional ini?')) router.delete(route('operasionalPays.destroy', row.original.id));
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
