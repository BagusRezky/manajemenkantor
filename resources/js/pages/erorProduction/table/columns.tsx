import { Checkbox } from '@/components/ui/checkbox';
import { ErorProduction } from '@/types/erorProduction';
import { ColumnDef } from '@tanstack/react-table';

export const columns = (): ColumnDef<ErorProduction>[] => [
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
        accessorKey: 'kode_eror',
        header: 'Kode Eror Production',
        cell: ({ row }) => {
            return <span className="font-mono">{row.getValue('kode_eror') || '-'}</span>;
        },
    },
    {
        accessorKey: 'nama_eror',
        header: 'Nama Eror Production',
        cell: ({ row }) => {
            return <span>{row.getValue('nama_eror') || '-'}</span>;
        },
    },

];
