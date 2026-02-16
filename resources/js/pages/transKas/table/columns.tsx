import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TransKas } from '@/types/transKas';


import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDownCircle, ArrowUpCircle, Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';

const handleDelete = (id: number) => {
    if (confirm('Hapus transaksi ini? Saldo COA terkait mungkin perlu disesuaikan manual.')) {
        router.delete(route('trans-kas.destroy', id), {
            onSuccess: () => toast.success('Transaksi berhasil dihapus'),
        });
    }
};

export const columns = (): ColumnDef<TransKas>[] => [
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
            const isMasuk = row.original.transaksi === 1;
            return (
                <div className="flex items-center gap-2">
                    {isMasuk ? <ArrowUpCircle className="h-4 w-4 text-green-500" /> : <ArrowDownCircle className="h-4 w-4 text-red-500" />}
                    <span className={isMasuk ? 'font-medium text-green-600' : 'font-medium text-red-600'}>{isMasuk ? 'Masuk' : 'Keluar'}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'no_bukti',
        header: 'No. Bukti',
    },
    {
        accessorKey: 'account_kas',
        header: 'Account Kas',
        accessorFn: (row) => row.account_kas?.kode_akuntansi + ' - ' + row.account_kas?.nama_akun || '',
    },

    {
        accessorKey: 'account_kas_lain',
        header: 'Account Kas Lain',
        accessorFn: (row) => row.account_kas_lain?.kode_akuntansi + ' - ' + row.account_kas_lain?.nama_akun || '',
    },
    {
        accessorKey: 'nominal',
        header: 'Nominal',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('nominal'));
            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
            }).format(amount);
            return <div className="font-mono font-bold">{formatted}</div>;
        },
    },
    {
        accessorKey: 'tanggal_transaksi',
        header: 'Tanggal Transaksi',
        cell: ({ row }) => row.getValue('tanggal_transaksi'),
    },
    {
        accessorKey: 'keterangan',
        header: 'Keterangan',
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
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => router.get(route('trans-kas.show', item.id))}>
                            <Eye className="mr-2 h-4 w-4" /> Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(route('trans-kas.edit', item.id))}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(item.id)}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
