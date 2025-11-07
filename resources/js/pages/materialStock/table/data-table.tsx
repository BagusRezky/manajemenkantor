/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataTablePagination } from '@/components/custom-pagination';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MaterialStock } from '@/types/materialStock';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import React from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    materialStocks: MaterialStock[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [statusFilter, setStatusFilter] = React.useState<string>('all');

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            columnFilters,
            sorting,
        },
    });

    // Filter by status
    React.useEffect(() => {
        if (statusFilter === 'all') {
            table.getColumn('status')?.setFilterValue(undefined);
        } else {
            table.getColumn('status')?.setFilterValue(statusFilter);
        }
    }, [statusFilter, table]);

    return (
        <div className="space-y-6">

            {/* Filters */}
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Cari kode atau nama item..."
                        value={(table.getColumn('kode_master_item')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => {
                            table.getColumn('kode_master_item')?.setFilterValue(event.target.value);
                            table.getColumn('nama_master_item')?.setFilterValue(event.target.value);
                        }}
                        className="max-w-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border-2 dark:border-0 dark:bg-violet-600">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Tidak ada data penerimaan barang.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="py-6">
                <DataTablePagination table={table} />
            </div>
        </div>
    );
}
