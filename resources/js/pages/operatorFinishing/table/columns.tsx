import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { OperatorFinishing } from '@/types/operatorFinishing';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const handleDelete = ($operatorFinishing: string) => {
    // Delete supplier with ID `id`
    router.delete(`/operatorFinishings/${$operatorFinishing}`, {
        onSuccess: () => {
            toast.success('operatorFinishing deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete operatorFinishing');
        },
    });
};

export const columns = (
    setIsModalOpen: (open: boolean) => void,
    setEditModalOpen: (open: boolean) => void,
    setSelectedOperatorFinishing: (operatorFinishing: OperatorFinishing | null) => void,
): ColumnDef<OperatorFinishing>[] => [
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
        accessorKey: 'nama_operator_finishing',
        header: 'Nama Operator Diemaking',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const operatorFinishing = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(operatorFinishing.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedOperatorFinishing(operatorFinishing);
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
