import { RekapAbsen } from '@/types/rekapAbsen';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<RekapAbsen>[] = [
    {
        accessorKey: 'nama',
        header: 'Nama Karyawan',
    },
    {
        accessorKey: 'hadir',
        header: 'Kehadiran',
    },
    {
        accessorKey: 'kedatangan_kali',
        header: 'Jumlah Kedatangan',
    },
    {
        accessorKey: 'pulang_kali',
        header: 'Jumlah Pulang',
    },
    {
        accessorKey: 'lembur_kali',
        header: 'Jumlah Lembur',
    },
    {
        accessorKey: 'total_jam_lembur',
        header: 'Total Jam Lembur',
    },
    {
        accessorKey: 'izin_kali',
        header: 'Izin',
    },
    {
        accessorKey: 'cuti_kali',
        header: 'Cuti',
    },
];
