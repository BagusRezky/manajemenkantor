'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Supplier = {
    id: string;
    kode_suplier: string;
    nama_suplier: string;
    jenis_suplier: string;
    keterangan: string;
};

export const columns: ColumnDef<Supplier>[] = [
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
];
