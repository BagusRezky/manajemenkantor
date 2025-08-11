import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TypeItem } from '@/types/typeItem';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const handleDelete = ($typeItem: string) => {
    // Delete supplier with ID `id`
    router.delete(`/typeItems/${$typeItem}`, {
        onSuccess: () => {
            toast.success('Type Item deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete Type Item');
        },
    });
};

export const columns = (
    setIsModalOpen: (open: boolean) => void,
    setEditModalOpen: (open: boolean) => void,
    setSelectedTypeItem: (typeItem: TypeItem | null) => void,
): ColumnDef<TypeItem>[] => [
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
        accessorKey: 'kode_type_item',
        header: 'Kode Type Item',
    },
    {
        accessorKey: 'nama_type_item',
        header: 'Nama Type Item',
    },
    {
        accessorKey: 'category_item.nama_category_item',
        header: 'Kategori',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const typeItem = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(typeItem.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedTypeItem(typeItem);
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
