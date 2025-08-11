import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MesinDiemaking } from '@/types/mesinDiemaking';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const handleDelete = ($mesinDiemaking: string) => {
    // Delete supplier with ID `id`
    router.delete(`/mesinDiemakings/${$mesinDiemaking}`, {
        onSuccess: () => {
            toast.success('mesin deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete mesin');
        },
    });
};

export const columns = (
    setIsModalOpen: (open: boolean) => void,
    setEditModalOpen: (open: boolean) => void,
    setSelectedMesinDieMaking: (mesin: MesinDiemaking | null) => void,
): ColumnDef<MesinDiemaking>[] => [
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
        accessorKey: 'nama_mesin_diemaking',
        header: 'Nama Mesin',
    },
    {
        accessorKey: 'jenis_mesin_diemaking',
        header: 'Jenis Mesin',
    },
    {
        accessorKey: 'kapasitas_diemaking',
        header: 'Kapasitas',
    },

    {
        accessorKey: 'proses_diemaking',
        header: 'Proses',
    },
    {
        accessorKey: 'status_diemaking',
        header: 'Status',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const mesin = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(mesin.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedMesinDieMaking(mesin);
                                setEditModalOpen(true);
                            }}
                        >
                            Updated
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
