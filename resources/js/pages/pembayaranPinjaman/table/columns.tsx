import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PembayaranPinjaman } from '@/types/pembayaranPinjaman'; // Ganti

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const handleDelete = (id: string) => {
    // Ganti URL
    router.delete(`/pembayaranPinjamans/${id}`, {
        onSuccess: () => toast.success('Pembayaran Pinjaman deleted successfully'),
        onError: () => toast.error('Failed to delete Pembayaran Pinjaman'),
    });
};

// Format Rupiah
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const columns = (): ColumnDef<PembayaranPinjaman>[] => [
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
        accessorKey: 'no_bukti_pembayaran',
        header: 'No Bukti',
    },
    {
        // Tampilkan nama karyawan dari relasi
        accessorKey: 'pengajuanPinjaman',
        header: 'Karyawan',
        cell: ({ row }) => {
            const nama = row.original.pengajuan_pinjaman?.karyawan?.nama;
            console.log(row.original);
            return <div>{nama || '-'}</div>;
        },
    },
    {
        accessorKey: 'tanggal_pembayaran',
        header: 'Tgl. Pembayaran',
    },
    {
        accessorKey: 'nominal_pembayaran',
        header: 'Nominal',
        cell: ({ row }) => {
            // Format sebagai mata uang
            return <div>{formatCurrency(row.original.nominal_pembayaran)}</div>;
        },
    },
    {
        accessorKey: 'keterangan',
        header: 'Keterangan',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const pembayaranPinjaman = row.original; // Ganti

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(pembayaranPinjaman.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* Ganti URL edit */}
                        <DropdownMenuItem onClick={() => router.get(`/pembayaranPinjamans/${pembayaranPinjaman.id}/edit`)}>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
