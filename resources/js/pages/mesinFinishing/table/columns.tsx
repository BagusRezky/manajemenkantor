
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import { MesinFinishing } from '@/types/mesinFinishing';


const handleDelete = ($mesinFinishing: string) => {
    // Delete supplier with ID `id`
    router.delete(`/mesinFinishings/${$mesinFinishing}`, {
        onSuccess: () => {
            toast.success('mesin deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete mesin');
        },
    });
};

export const columns = (setIsModalOpen:(open:boolean)=>void,
setEditModalOpen:(open:boolean)=>void,
setSelectedMesinFinishing:(mesin: MesinFinishing| null) =>void): ColumnDef<MesinFinishing>[]=> [
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
        accessorKey: 'nama_mesin_finishing',
        header: 'Nama Mesin',
    },
    {
        accessorKey: 'jenis_mesin_finishing',
        header: 'Jenis Mesin',
    },
    {
        accessorKey: 'kapasitas_finishing',
        header: 'Kapasitas',
    },

    {
        accessorKey: 'proses_finishing',
        header: 'Proses',
    },
    {
        accessorKey: 'status_finishing',
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
                        <DropdownMenuItem onClick={() => {  setSelectedMesinFinishing(mesin); setEditModalOpen(true);

                        }}>
                            Updated
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
