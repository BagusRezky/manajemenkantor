import { Gaji } from '@/types/gaji';
import { ColumnDef } from '@tanstack/react-table';


export const columns: ColumnDef<Gaji>[] = [
    {
        accessorKey: 'nama',
        header: 'Nama Karyawan',
    },
    {
        accessorKey: 'hadir',
        header: 'Hadir (hari)',
    },
    {
        accessorKey: 'total_lembur_jam',
        header: 'Total Lembur (jam)',
    },
    {
        accessorKey: 'gaji_pokok',
        header: 'Gaji Pokok',
        cell: ({ row }) => `Rp ${row.original.gaji_pokok.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'tunjangan',
        header: 'Tunjangan',
        cell: ({ row }) => `Rp ${row.original.tunjangan.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'bonus',
        header: 'Bonus',
        cell: ({ row }) => `Rp ${row.original.bonus.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'total_akhir',
        header: 'Total Gaji',
        cell: ({ row }) => `Rp ${row.original.total_akhir.toLocaleString('id-ID')}`,
    },
];
