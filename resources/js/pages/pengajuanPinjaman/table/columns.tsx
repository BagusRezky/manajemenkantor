// pages/pengajuanPinjaman/table/columns.tsx

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PengajuanPinjaman } from '@/types/pengajuanPinjaman';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const handleDelete = (id: string) => {
    router.delete(`/pengajuanPinjamans/${id}`, {
        onSuccess: () => toast.success('Data Pengajuan Pinjaman berhasil dihapus'),
        onError: () => toast.error('Gagal menghapus data'),
    });
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const columns = (): ColumnDef<PengajuanPinjaman>[] => [
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
        accessorKey: 'nomor_bukti_pengajuan',
        header: 'Nomor Bukti',
    },
    {
        accessorKey: 'karyawan.nama',
        header: 'Karyawan',
        cell: ({ row }) => row.original.karyawan?.nama || 'N/A',
    },
    {
        accessorKey: 'tanggal_pengajuan',
        header: 'Tanggal',
    },
    {
        accessorKey: 'nilai_pinjaman',
        header: 'Nilai Pinjaman',
        cell: ({ row }) => formatCurrency(row.getValue('nilai_pinjaman')),
    },
    {
        accessorKey: 'jangka_waktu_pinjaman',
        header: 'Jangka Waktu',
        cell: ({ row }) => `${row.getValue('jangka_waktu_pinjaman')} Bulan`,
    },
    {
        accessorKey: 'cicilan_per_bulan',
        header: 'Cicilan / Bulan',
        cell: ({ row }) => formatCurrency(row.getValue('cicilan_per_bulan')),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const pengajuanPinjaman = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.get(`/pengajuanPinjamans/${pengajuanPinjaman.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(pengajuanPinjaman.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
