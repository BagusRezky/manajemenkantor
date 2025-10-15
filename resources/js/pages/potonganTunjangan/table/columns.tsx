// pages/potonganTunjangan/table/columns.tsx

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PotonganTunjangan } from '@/types/potonganTunjangan';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const handleDelete = (id: string) => {
    router.delete(`/potonganTunjangans/${id}`, {
        onSuccess: () => toast.success('Data Potongan Tunjangan berhasil dihapus'),
        onError: () => toast.error('Gagal menghapus data'),
    });
};

export const columns = (): ColumnDef<PotonganTunjangan>[] => [
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
        accessorKey: 'karyawan.nama_karyawan',
        header: 'Karyawan',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.karyawan?.nama || '-'}</span>;
        },
    },
    {
        accessorKey: 'periode_payroll',
        header: 'Periode Payroll',
    },
    {
        accessorKey: 'potongan_tunjangan_jabatan',
        header: 'Potongan Jabatan',
    },
    {
        accessorKey: 'potongan_tunjangan_kompetensi',
        header: 'Potongan Kompetensi',
    },
    {
        accessorKey: 'potongan_intensif',
        header: 'Potongan Intensif',
    },
    {
        accessorKey: 'keterangan',
        header: 'Keterangan',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const potonganTunjangan = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.get(`/potonganTunjangans/${potonganTunjangan.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(potonganTunjangan.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
