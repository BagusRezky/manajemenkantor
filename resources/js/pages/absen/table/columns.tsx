import { ColumnDef } from '@tanstack/react-table';
import { Absen } from '../../../types/absen';

export const columns = (): ColumnDef<Absen>[] => [
    {
        accessorKey: 'tanggal_scan',
        header: 'Tanggal Scan',
    },
    {
        accessorKey: 'tanggal',
        header: 'Tanggal',
    },
    {
        accessorKey: 'jam',
        header: 'Jam',
    },
    {
        accessorKey: 'pin',
        header: 'PIN',
    },
    {
        accessorKey: 'nip',
        header: 'NIP',
    },
    {
        accessorKey: 'nama',
        header: 'Nama',
    },
    {
        accessorKey: 'jabatan',
        header: 'Jabatan',
    },
    {
        accessorKey: 'departemen',
        header: 'Departemen',
    },
    {
        accessorKey: 'kantor',
        header: 'Kantor',
    },
    {
        accessorKey: 'verifikasi',
        header: 'Verifikasi',
    },
    {
        accessorKey: 'io',
        header: 'I/O',
    },
    {
        accessorKey: 'workcode',
        header: 'Workcode',
    },
    {
        accessorKey: 'sn',
        header: 'SN',
    },
    {
        accessorKey: 'mesin',
        header: 'Mesin',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const absen = row.original;
            return (
                <div className="space-x-2">
                    <a href={route('absens.edit', absen.id)} className="text-blue-500 hover:underline">
                        Edit
                    </a>
                </div>
            );
        },
    },
];
