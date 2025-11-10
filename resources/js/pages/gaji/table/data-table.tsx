import { Gaji } from '@/types/gaji';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';


interface DataTableProps {
    columns: ColumnDef<Gaji>[];
    data: Gaji[];
}

export function DataTable({ columns, data }: DataTableProps) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="mt-4 rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-2 text-sm text-gray-800">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-3 text-center text-sm text-gray-500">
                                Tidak ada data gaji
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
