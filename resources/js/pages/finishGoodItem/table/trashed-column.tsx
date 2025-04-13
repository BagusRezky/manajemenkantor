import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FinishGoodItem } from '@/types/finishGoodItem';
import { router } from '@inertiajs/react';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export const trashedColumns = (): ColumnDef<FinishGoodItem>[] => {

    const handleRestore = (id: string) => {
        router.post(
            `/finishGoodItems/${id}/restore`,
            {},
            {
                onSuccess: () => {
                    toast.success('Item restored successfully');
                },
                onError: () => {
                    toast.error('Failed to restore item');
                },
            },
        );
    };

    const handleForceDelete = (id: string) => {
        if (confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) {
            router.delete(`/finishGoodItems/${id}/force-delete`, {
                onSuccess: () => {
                    toast.success('Item permanently deleted');
                },
                onError: () => {
                    toast.error('Failed to delete item');
                },
            });
        }
    };

    return [
        {
            accessorKey: 'kode_barcode',
            header: 'Kode Barang',
        },
        {
            accessorKey: 'kode_material_produk',
            header: 'Kode Material',
        },
        {
            accessorKey: 'nama_barang',
            header: 'Nama Barang',
        },
        {
            accessorKey: 'deleted_at',
            header: 'Tanggal Cut Off',
            cell: ({ row }) => {
                const date = new Date(row.original.deleted_at);
                return date.toLocaleString();
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRestore(item.id)}>Restore</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleForceDelete(item.id)} className="text-red-600 focus:text-red-600">
                                Delete Permanently
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
};
