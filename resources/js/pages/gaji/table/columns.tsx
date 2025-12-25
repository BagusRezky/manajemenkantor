import { Gaji } from '@/types/gaji';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Gaji>[] = [
    {
        accessorKey: 'nama',
        header: 'Nama Karyawan',
    },
    {
        accessorKey: 'hadir',
        header: 'Hadir',
    },
    {
        accessorKey: 'total_izin',
        header: 'Total Izin',
    },
    {
        accessorKey: 'total_cuti_semua',
        header: 'Total Cuti',
    },
    {
        accessorKey: 'total_alpha',
        header: 'Total Alpha',
    },
    {
        accessorKey: 'total_lembur',
        header: 'Total Lembur',
    },
    {
        accessorKey: 'gaji_pokok',
        header: 'Gaji Pokok',
        cell: ({ row }) => `Rp ${row.original.gaji_pokok.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'tunjangan_kompetensi',
        header: 'Tunj. Kompetensi',
        cell: ({ row }) => `Rp ${row.original.tunjangan_kompetensi.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'tunjangan_jabatan',
        header: 'Tunj. Jabatan',
        cell: ({ row }) => `Rp ${row.original.tunjangan_jabatan.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'tunjangan_intensif',
        header: 'Tunj. Intensif',
        cell: ({ row }) => `Rp ${row.original.tunjangan_intensif.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'potongan_kompetensi',
        header: 'Pot. Kompetensi',
        cell: ({ row }) => `Rp ${row.original.potongan_kompetensi.toLocaleString('id-ID')}`,
    },

    {
        accessorKey: 'potongan_jabatan',
        header: 'Pot. Jabatan',
        cell: ({ row }) => `Rp ${row.original.potongan_jabatan.toLocaleString('id-ID')}`,
    },

    {
        accessorKey: 'potongan_intensif',
        header: 'Pot. Intensif',
        cell: ({ row }) => `Rp ${row.original.potongan_intensif.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'bonus',
        header: 'Bonus',
        cell: ({ row }) => `Rp ${row.original.bonus.toLocaleString('id-ID')}`,
    },
    {
        accessorKey: 'total_gaji',
        header: 'Gaji Terima',
        cell: ({ row }) => <span className="font-bold text-green-600">Rp {row.original.total_gaji.toLocaleString('id-ID')}</span>,
    },
];
