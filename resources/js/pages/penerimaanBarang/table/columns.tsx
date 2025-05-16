import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PenerimaanBarang } from "@/types/penerimaanBarang";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Penerimaan Barang ini?')) {
        router.delete(`/penerimaanBarangs/${id}`, {
            onSuccess: () => {
                toast.success('Penerimaan Barang berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Penerimaan Barang');
            },
        });
    }
};

const handleView = (id: string) => {
    router.get(`/penerimaanBarangs/${id}`);
};

export const columns = (): ColumnDef<PenerimaanBarang>[] => [
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
        accessorKey: 'no_laporan_barang',
        header: 'No. Laporan Barang',
    },
    {
        accessorKey: 'purchase_order.no_po',
        header: 'No. PO',
        cell: ({ row }) => {
            const data = row.original;
            return <span>{data.purchase_order?.no_po || '-'}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(data.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Detail
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(data.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
