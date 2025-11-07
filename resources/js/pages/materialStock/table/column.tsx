import { Button } from '@/components/ui/button';
import { MaterialStock } from '@/types/materialStock';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export const columns = (): ColumnDef<MaterialStock>[] => [
  {
    accessorKey: 'kode_master_item',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Kode Item
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const data = row.original;
      const isLowStock = data.onhand_stock < data.min_stock; // <- Logika
      return (
        <div className={`flex items-center space-x-2 ${isLowStock ? 'text-red-600' : ''}`}>
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
      const isLowStock = data.onhand_stock < data.min_stock; // <- Logika
      return (
        <div className={isLowStock ? 'text-red-600' : ''}>
          <div className="font-medium">{data.nama_master_item}</div>
          {/* Kita buat sub-teks sedikit lebih pudar jika merah */}
          <div className={`text-sm ${isLowStock ? 'text-red-600/70' : 'text-gray-500'}`}>
            {data.nama_type_barang}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'satuan',
    header: 'Satuan',
    cell: ({ row }) => {
      const data = row.original; // <- Ambil data original
      const isLowStock = data.onhand_stock < data.min_stock; // <- Logika
      return <span className={`text-sm ${isLowStock ? 'text-red-600' : ''}`}>{row.getValue('satuan')}</span>;
    },
  },
  {
    accessorKey: 'min_stock',
    header: 'Min Stock',
    cell: ({ row }) => {
      const data = row.original; // <- Ambil data original
      const isLowStock = data.onhand_stock < data.min_stock; // <- Logika
      return (
        <span className={`text-right font-mono ${isLowStock ? 'text-red-600' : ''}`}>
          {row.getValue('min_stock')}
        </span>
      );
    },
  },
  {
    accessorKey: 'onhand_stock',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Onhand Stock
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const data = row.original; // <- Ambil data original
      const isLowStock = data.onhand_stock < data.min_stock; // <- Logika
      const value = row.getValue('onhand_stock') as number;
      return (
        <span className={`text-right font-mono font-bold ${isLowStock ? 'text-red-600' : ''}`}>
          {value.toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: 'outstanding_stock',
    header: 'Outstanding',
    cell: ({ row }) => {
      const data = row.original; // <- Ambil data original
      const isLowStock = data.onhand_stock < data.min_stock; // <- Logika
      const value = row.getValue('outstanding_stock') as number;

      // Ganti class 'text-yellow-600' dengan 'text-red-600' jika stok rendah
      const className = isLowStock ? 'text-red-600' : 'text-yellow-600';

      return <span className={`text-right font-mono ${className}`}>{value.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: 'allocation_stock',
    header: 'Allocation',
    cell: ({ row }) => {
      const data = row.original; // <- Ambil data original
      const isLowStock = data.onhand_stock < data.min_stock; // <- Logika
      const value = row.getValue('allocation_stock') as number;

      // Ganti class 'text-green-600' dengan 'text-red-600' jika stok rendah
      const className = isLowStock ? 'text-red-600' : 'text-green-600';

      return <span className={`text-right font-mono ${className}`}>{value.toFixed(2)}</span>;
    },
  },
];
