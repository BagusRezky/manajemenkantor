import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Cuti } from '@/types/cuti';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const handleDelete = (id: string) => {
    // Ganti URL
    router.delete(`/cutis/${id}`, {
        onSuccess: () => toast.success('Cuti deleted successfully'),
        onError: () => toast.error('Failed to delete cuti'),
    });
};

export const columns = (): ColumnDef<Cuti>[] => [
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
        id: 'karyawan',
        header: 'Karyawan',
        accessorFn: (row) => row.karyawan?.nama,
        cell: ({ row }) => {
            const nama = row.getValue('karyawan') as string;
            return <div>{nama || '-'}</div>;
        },
    },
    {
        accessorKey: 'tanggal_cuti',
        header: 'Tanggal Cuti',
    },
    {
        accessorKey: 'jenis_cuti',
        header: 'Jenis Cuti',
    },
    {
        accessorKey: 'lampiran',
        header: 'Lampiran',
        cell: ({ row }) => {
            const lampiran = row.original.lampiran;
            if (!lampiran) return '-';
            // Asumsi file disimpan di public storage
            return (
                <a href={`/storage/${lampiran}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Lihat
                </a>
            );
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
            const cuti = row.original; // Ganti

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(cuti.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* Ganti URL edit */}
                        <DropdownMenuItem onClick={() => router.get(`/cutis/${cuti.id}/edit`)}>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
