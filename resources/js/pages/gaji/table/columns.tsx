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
        accessorKey: 'total_lembur',
        header: 'Total Lembur',
    },
    {
        accessorKey: 'total_cuti_semua',
        header: 'Total Cuti (Semua)',
    },
    {
        accessorKey: 'cuti_tahunan_digunakan',
        header: 'Cuti Tahunan Digunakan',
    },
    {
        accessorKey: 'gaji_pokok',
        header: 'Gaji Pokok',
        cell: ({ row }) => `Rp ${row.original.gaji_pokok.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'tunjangan_kompetensi',
        header: 'Tunjangan Kompetensi',
        cell: ({ row }) => `Rp ${row.original.tunjangan_kompetensi.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'tunjangan_jabatan',
        header: 'Tunjangan Jabatan',
        cell: ({ row }) => `Rp ${row.original.tunjangan_jabatan.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'tunjangan_intensif',
        header: 'Tunjangan Intensif',
        cell: ({ row }) => `Rp ${row.original.tunjangan_intensif.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'bonus',
        header: 'Bonus',
        cell: ({ row }) => `Rp ${row.original.bonus.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'total_gaji',
        header: 'Total Gaji',
        cell: ({ row }) => `Rp ${row.original.total_gaji.toLocaleString('id-ID')}`,
    },
];
