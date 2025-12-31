import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Karyawan } from '@/types/karyawan'; // Pastikan path import ini benar

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Fungsi delete seperti contoh lembur
const handleDelete = (id: number) => {
    // Sesuaikan route-nya dengan route delete karyawan Anda
    router.delete(route('karyawan.destroy', id), {
        onSuccess: () => toast.success('Karyawan deleted successfully'),
        onError: () => toast.error('Failed to delete karyawan'),
    });
};

export const columns = (): ColumnDef<Karyawan>[] => [
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
        accessorKey: 'nip',
        header: 'NIP',
    },
    {
        accessorKey: 'nama',
        header: 'Nama',
    },
    {
        accessorKey: 'jabatan',
        header: 'Jabatan',
    },
    {
        accessorKey: 'departemen',
        header: 'Departemen',
    },
    {
        accessorKey: 'status_pegawai',
        header: 'Status',
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => row.original.user?.roles?.[0]?.name ?? '',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const karyawan = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(karyawan.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* Mengarahkan ke halaman edit, bukan modal */}
                        <DropdownMenuItem onClick={() => router.get(`/karyawans/${karyawan.id}/edit`)}>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
