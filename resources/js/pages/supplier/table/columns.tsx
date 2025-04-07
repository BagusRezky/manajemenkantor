
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import { Supplier } from '@/types/supplier';

const handleDelete = ($supplier: string) => {
    // Delete supplier with ID `id`
    router.delete(`/suppliers/${$supplier}`, {
        onSuccess: () => {
            toast.success('Supplier deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete supplier');
        },
    });
};

export const columns = (setIsModalOpen:(open:boolean)=>void,
setEditModalOpen:(open:boolean)=>void,
setSelectedSupplier:(supplier: Supplier | null) =>void): ColumnDef<Supplier>[]=> [
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
        accessorKey: 'kode_suplier',
        header: 'Kode Suplier',
    },
    {
        accessorKey: 'nama_suplier',
        header: 'Nama Suplier',
    },
    {
        accessorKey: 'jenis_suplier',
        header: 'Jenis Suplier',
    },
    {
        accessorKey: 'keterangan',
        header: 'Keterangan',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const supplier = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(supplier.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {  setSelectedSupplier(supplier); setEditModalOpen(true);

                        }}>
                            Updated
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
