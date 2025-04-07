import { DataTablePagination } from '@/components/custom-pagination';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import {  SupplierFormModal } from '../modal/add-modal';
import { Supplier } from '@/types/supplier';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    suppliers: Supplier[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            columnFilters,
            rowSelection,
        },
    });

    return (
        <div>
            <div className="flex space-x-190 py-4">
                <Input
                    placeholder="Cari Kode Suplier..."
                    value={(table.getColumn('kode_suplier')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('kode_suplier')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <SupplierFormModal />
            </div>
            <div className="rounded-md bg-violet-600">
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
                                    No results.
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
