import { Checkbox } from '@/components/ui/checkbox';

import { RekapPinjaman } from '@/types/rekap';
import { ColumnDef } from '@tanstack/react-table';

// Format Rupiah
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const columns = (): ColumnDef<RekapPinjaman>[] => [
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
        accessorKey: 'nama_karyawan',
        header: 'Nama Karyawan',
    },
    {
        accessorKey: 'total_pinjaman',
        header: 'Total Pinjaman',
        cell: ({ row }) => <div>{formatCurrency(row.original.total_pinjaman)}</div>,
    },
    {
        accessorKey: 'total_bayar',
        header: 'Total Pembayaran',
        cell: ({ row }) => <div>{formatCurrency(row.original.total_bayar)}</div>,
    },
    {
        accessorKey: 'sisa',
        header: 'Sisa Pinjaman',
        cell: ({ row }) => (
            <div className={row.original.sisa <= 0 ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
                {formatCurrency(row.original.sisa)}
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <span className={`rounded-md px-2 py-1 text-white ${row.original.status === 'Lunas' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                {row.original.status}
            </span>
        ),
    },
];
