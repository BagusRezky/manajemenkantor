
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import { OperatorDiemaking } from '@/types/operatorDiemaking';


const handleDelete = ($operatorDiemaking: string) => {
    // Delete supplier with ID `id`
    router.delete(`/operatorDiemakings/${$operatorDiemaking}`, {
        onSuccess: () => {
            toast.success('operatorDiemaking deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete operatorDiemaking');
        },
    });
};

export const columns = (setIsModalOpen:(open:boolean)=>void,
setEditModalOpen:(open:boolean)=>void,
setSelectedOperatorDiemaking:(operatorDiemaking: OperatorDiemaking| null) =>void): ColumnDef<OperatorDiemaking>[]=> [
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
        accessorKey: 'nama_operator_diemaking',
        header: 'Nama Operator Diemaking',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const operatorDiemaking = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(operatorDiemaking.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {  setSelectedOperatorDiemaking(operatorDiemaking); setEditModalOpen(true);

                        }}>
                            Updated
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
