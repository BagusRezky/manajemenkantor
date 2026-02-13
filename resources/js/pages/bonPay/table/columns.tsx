import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BonPay } from '@/types/bonPay';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const columns: ColumnDef<BonPay>[] = [
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
        accessorKey: 'nomor_pembayaran',
        header: 'No. Bayar',
        cell: ({ row }) => <span className="font-mono font-bold">{row.getValue('nomor_pembayaran')}</span>,
    },
    {
        accessorKey: 'invoice.no_invoice',
        header: 'No. Invoice',
    },
    {
        accessorKey: 'tanggal_pembayaran',
        header: 'Tanggal',
        cell: ({ row }) => format(new Date(row.getValue('tanggal_pembayaran')), 'dd MMMM yyyy'),
    },
    {
        accessorKey: 'nominal_pembayaran',
        header: 'Nominal',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('nominal_pembayaran'));
            return <div className="font-semibold text-green-600">Rp {amount.toLocaleString('id-ID')}</div>;
        },
    },
    {
        accessorKey: 'metode_bayar.metode_bayar',
        header: 'Metode',
    },
    { accessorKey: 'keterangan', header: 'Keterangan' },
    {
        header: 'Aksi',
        id: 'actions',
        cell: ({ row }) => {
            const bonPay = row.original;

            const deleteBonPay = () => {
                if (confirm('Hapus pembayaran ini? Saldo invoice akan dihitung ulang.')) {
                    router.delete(route('bonPays.destroy', bonPay.id), {
                        onSuccess: () => toast.success('Pembayaran berhasil dihapus'),
                    });
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        {/* <DropdownMenuItem onClick={() => router.get(route('invoices.show', bonPay.id_invoice))}>
                            <Eye className="mr-2 h-4 w-4" /> Lihat Invoice
                        </DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => router.get(route('bonPays.show', bonPay.id))}>
                            <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={deleteBonPay} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
