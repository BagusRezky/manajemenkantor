import { DataTablePagination } from '@/components/custom-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Gaji } from '@/types/gaji';
import { router } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';

interface DataTableProps {
    columns: ColumnDef<Gaji>[];
    data: Gaji[];
    filters: { start_date: string; end_date: string };
}

export function DataTable({ columns, data, filters }: DataTableProps) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [dateRange, setDateRange] = useState(filters);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { columnFilters },
        meta: {
            filters: filters, 
        },
    });

    const handleFilter = () => {
        router.get(route('gajis.index'), dateRange, {
            preserveState: true,
            replace: true,
        });
    };
    return (
        <div className="space-y-4">
            {/* Filter Section di dalam Data Table */}
            <div className="flex items-end gap-3 rounded-md border bg-slate-50 p-4">
                <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tanggal Mulai</label>
                    <input
                        type="date"
                        value={dateRange.start_date}
                        onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                        className="border-input rounded-md border p-2 text-sm"
                    />
                </div>
                <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tanggal Selesai</label>
                    <input
                        type="date"
                        value={dateRange.end_date}
                        onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                        className="border-input rounded-md border p-2 text-sm"
                    />
                </div>
                <Button onClick={handleFilter} variant="default">
                    Terapkan Filter
                </Button>
            </div>
            <div className="flex space-x-190 py-4">
                <Input
                    placeholder="Cari Nama Karyawan..."
                    value={(table.getColumn('nama')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('nama')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="py-6">
                <DataTablePagination table={table} />
            </div>
        </div>
    );
}
