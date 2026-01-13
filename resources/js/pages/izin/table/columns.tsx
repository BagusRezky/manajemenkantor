import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Izin } from '@/types/izin';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const handleDelete = (id: string) => {
    router.delete(`/izins/${id}`, {
        onSuccess: () => toast.success('Izin deleted successfully'),
        onError: () => toast.error('Failed to delete izin'),
    });
};

export const columns = (): ColumnDef<Izin>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id_karyawan',
        header: 'Karyawan',
        accessorFn: (row) => row.karyawan?.nama,
        cell: ({ row }) => {
            const nama = row.getValue('karyawan') as string;
            return <div>{nama || '-'}</div>;
        },
    },
    {
        accessorKey: 'tanggal_izin',
        header: 'Tanggal Izin',
    },
    {
        accessorKey: 'jenis_izin',
        header: 'Jenis Izin',
    },
    {
        accessorKey: 'jam_awal_izin',
        header: 'Jam Awal',
    },
    {
        accessorKey: 'jam_selesai_izin',
        header: 'Jam Selesai',
    },
    {
        accessorKey: 'keterangan',
        header: 'Keterangan',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const izin = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleDelete(izin.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/izins/${izin.id}/edit`)}>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
