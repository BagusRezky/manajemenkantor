import { MaterialStock } from '@/types/materialStock';
import { ColumnDef } from '@tanstack/react-table';
export const columns = (): ColumnDef<MaterialStock>[] => [
    {
        accessorKey: 'kode_master_item',
        header: 'Kode Item',
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="flex items-center space-x-2">

                    <span className="font-mono text-sm">{data.kode_master_item}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'nama_master_item',
        header: 'Nama Item',
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div>
                    <div className="font-medium">{data.nama_master_item}</div>
                    <div className="text-sm text-gray-500">{data.nama_type_barang}</div>
                </div>
            );
        },
    },
    {
        accessorKey: 'satuan',
        header: 'Satuan',
        cell: ({ row }) => {
            return <span className="text-sm">{row.getValue('satuan')}</span>;
        },
    },
    {
        accessorKey: 'min_stock',
        header: 'Min Stock',
        cell: ({ row }) => {
            return <span className="text-right font-mono">{row.getValue('min_stock')}</span>;
        },
    },
    {
        accessorKey: 'onhand_stock',
        header: 'Onhand Stock',
        cell: ({ row }) => {
            const value = row.getValue('onhand_stock') as number;
            return <span className="text-right font-mono font-bold">{value.toFixed(2)}</span>;
        },
    },
    {
        accessorKey: 'outstanding_stock',
        header: 'Outstanding',
        cell: ({ row }) => {
            const value = row.getValue('outstanding_stock') as number;
            return <span className="text-right font-mono text-blue-600">{value.toFixed(2)}</span>;
        },
    },
    {
        accessorKey: 'allocation_stock',
        header: 'Allocation',
        cell: ({ row }) => {
            const value = row.getValue('allocation_stock') as number;
            return <span className="text-right font-mono text-orange-600">{value.toFixed(2)}</span>;
        },
    },
];
