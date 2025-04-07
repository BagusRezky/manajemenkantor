
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import { MasterKonversi } from '@/types/masterKonversi';

const handleDelete = ($masterKonversi: string) => {
    // Delete supplier with ID `id`
    router.delete(`/masterKonversis/${$masterKonversi}`, {
        onSuccess: () => {
            toast.success('Unit deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete unit');
        },
    });
};

export const columns = (
    setEditModalOpen: (open: boolean) => void,
    setSelectedMasterKonversi: (masterKonversi: MasterKonversi | null) => void,
): ColumnDef<MasterKonversi>[] => [
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
        accessorKey: 'type_item.nama_type_item',
        header: 'Tipe Barang',
    },
    {
        accessorKey: 'satuan_satu.nama_satuan',
        header: 'Satuan Satu',
    },
    {
        accessorKey: 'satuan_dua.nama_satuan',
        header: 'Satuan Dua',
    },
    {
        accessorKey: 'jumlah_satuan_konversi',
        header: 'Jumlah Konversi',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const masterKonversi = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(masterKonversi.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                console.log(masterKonversi);
                                setSelectedMasterKonversi(masterKonversi);
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
