
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import { TypeOffice } from '@/types/typeOffice';



const handleDelete = ($typeOffice: string) => {
    // Delete supplier with ID `id`
    router.delete(`/typeOffices/${$typeOffice}`, {
        onSuccess: () => {
            toast.success('Type Office deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete Type Office');
        },
    });
};

export const columns = (setIsModalOpen:(open:boolean)=>void,
setEditModalOpen:(open:boolean)=>void,
setSelectedTypeOffice:(typeOffice: TypeOffice | null) =>void): ColumnDef<TypeOffice>[]=> [
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
        accessorKey: 'kode_type_office',
        header: 'Kode Office Item',
    },
    {
        accessorKey: 'nama_type_office',
        header: 'Name Office Item',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const typeOffice = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(typeOffice.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {  setSelectedTypeOffice(typeOffice); setEditModalOpen(true);

                        }}>
                            Updated
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
