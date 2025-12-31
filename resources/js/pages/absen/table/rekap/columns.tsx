import { RekapAbsen } from '@/types/rekapAbsen';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<RekapAbsen>[] = [
    {
        accessorKey: 'nama',
        header: 'Nama Karyawan',
    },
    {
        accessorKey: 'hadir',
        header: 'Kehadiran (Hari)',
    },
    {
        accessorKey: 'izin_kali',
        header: 'Izin',
    },
    {
        accessorKey: 'cuti_kali',
        header: 'Cuti',
    },
    {
        accessorKey: 'alpha_kali',
        header: 'Alpha',
    },
    {
        accessorKey: 'kedatangan_kali',
        header: 'Scan Masuk',
    },
    {
        accessorKey: 'pulang_kali',
        header: 'Scan Pulang',
    },
    {
        accessorKey: 'total_jam_lembur',
        header: 'Total Jam Lembur',
    },
];
