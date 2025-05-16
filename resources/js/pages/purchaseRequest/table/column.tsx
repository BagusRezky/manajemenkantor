import { Checkbox } from "@/components/ui/checkbox";
import { router } from "@inertiajs/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PurchaseRequest } from "@/types/purchaseRequest";


const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Purchase Request ini?')) {
        router.delete(`/purchaseRequest/${id}`, {
            onSuccess: () => {
                toast.success('Purchase Request berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Purchase Request');
            },
        });
    }
};

const handleAuthorize = (id: string) => {
    if (confirm('Apakah Anda yakin ingin mengotorisasi Purchase Request ini?')) {
        router.post(
            `/purchaseRequest/${id}/authorize`,
            {},
            {
                onSuccess: () => {
                    toast.success('Purchase Request berhasil diotorisasi');
                },
                onError: () => {
                    toast.error('Gagal mengotorisasi Purchase Request');
                },
            },
        );
    }
};

export const columns = (): ColumnDef<PurchaseRequest>[] => [
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
        accessorKey: 'no_pr',
        header: 'No. PR',
    },
    {
        accessorKey: 'departemen.nama_departemen',
        header: 'Departemen',
        cell: ({ row }) => row.original.departemen?.nama_departemen || '-',
    },
    {
        accessorKey: 'tgl_pr',
        header: 'Tanggal PR',
        cell: ({ row }) => {
            const date = row.original.tgl_pr;
            if (!date) return '-';

            // Assuming date is in a compatible format
            try {
                const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format
                return formattedDate;
            } catch {
                return date; // Return original if formatting fails
            }
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;

            // Apply styling based on status
            if (status === 'Otorisasi') {
                return <span className="rounded-md bg-green-100 px-2 py-1 text-green-800">{status}</span>;
            } else {
                return <span className="rounded-md bg-red-200 px-2 py-1 text-red-800">{status}</span>;
            }
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
                        <DropdownMenuItem onClick={() => handleDelete(item.id)}>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/purchaseRequest/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(`/purchaseRequest/${item.id}/detail`)}>Detail</DropdownMenuItem>
                        {item.status === 'Deotorisasi' && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleAuthorize(item.id)}>Otorisasi</DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => window.open(route('purchaseRequest.pdf', { id: item.id, preview: true }), '_blank')}>
                            Preview PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => window.open(route('purchaseRequest.pdf', { id: item.id, download: true }), '_blank')}>
                            Download PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
