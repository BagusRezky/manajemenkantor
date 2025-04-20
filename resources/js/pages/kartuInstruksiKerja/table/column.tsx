import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { KartuInstruksiKerja } from '@/types/kartuInstruksiKerja';

import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';




const handleDelete = (item: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kartu instruksi kerja ini?')) {
        router.delete(`/kartuInstruksiKerja/${item}`, {
            onSuccess: () => {
                toast.success('Kartu Instruksi Kerja berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus Kartu Instruksi Kerja');
            },
        });
    }
};

export const columns = (
    setSelectedItem: (item: KartuInstruksiKerja | null) => void,
    openDetailModal: (item: KartuInstruksiKerja) => void,
): ColumnDef<KartuInstruksiKerja>[] => [
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
        accessorKey: 'no_kartu_instruksi_kerja',
        header: 'No. Surat Perintah Kerja',
    },
    {
        accessorKey: 'sales_order.no_bon_pesanan',
        header: 'No. Sales Order',
        cell: ({ row }) => row.original.sales_order?.no_bon_pesanan || '-',
    },
    {
        accessorKey: 'production_plan',
        header: 'Production Plan',
    },
    {
        accessorKey: 'tgl_estimasi_selesai',
        header: 'Tanggal Estimasi Selesai',
        cell: ({ row }) => {
            const date = row.original.tgl_estimasi_selesai;
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
        accessorKey: 'sales_order.finish_good_item.nama_barang',
        header: 'Nama Produk',
        cell: ({ row }) => row.original.sales_order?.finish_good_item?.nama_barang || '-',
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
                        {/* <DropdownMenuItem onClick={() => router.get(`/kartuInstruksiKerja/${item.id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => openDetailModal(item)}>Detail</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
