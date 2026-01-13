// pages/bonusKaryawan/table/columns.tsx

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BonusKaryawan } from '@/types/bonusKaryawan';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const handleDelete = (id: string) => {
    router.delete(`/bonusKaryawans/${id}`, {
        onSuccess: () => toast.success('Data Bonus Karyawan berhasil dihapus'),
        onError: () => toast.error('Gagal menghapus data'),
    });
};

export const columns = (): ColumnDef<BonusKaryawan>[] => [
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
        accessorKey: 'kode_gudang',
        header: 'Kode Gudang',
    },
    {
        accessorKey: 'karyawan',
        header: 'Karyawan',
        accessorFn: (row) => row.karyawan?.nama,
        cell: ({ row }) => {
            const nama = row.getValue('karyawan') as string;
            return <div>{nama || '-'}</div>;
        },
    },
    {
        accessorKey: 'tanggal_bonus',
        header: 'Tanggal Bonus',
    },
    {
        accessorKey: 'nilai_bonus',
        header: 'Nilai Bonus',
        cell: ({ row }) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(row.getValue('nilai_bonus'));
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
            const bonusKaryawan = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.get(`/bonusKaryawans/${bonusKaryawan.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(bonusKaryawan.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
