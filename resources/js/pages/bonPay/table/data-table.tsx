import { DataTablePagination } from '@/components/custom-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, router } from '@inertiajs/react';
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Plus, Upload } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,

        state: {
            columnFilters,
            rowSelection,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        router.post(route('bonPays.import'), formData, {
            onSuccess: () => {
                e.target.value = '';
                toast.success('File berhasil diimpor!');
            },
            onError: () => {
                toast.error('Gagal mengimpor file.');
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between py-4">
                <Input
                    placeholder="Cari Nomor Pembayaran..."
                    value={(table.getColumn('nomor_pembayaran')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('nomor_pembayaran')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <div className="ml-auto flex space-x-3">
                    {/* Upload Excel */}
                    <Button type="button" variant="outline" onClick={() => document.getElementById('excel-upload')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Excel
                    </Button>
                    <input type="file" name="file" accept=".xlsx,.xls,.csv" className="hidden" id="excel-upload" onChange={handleImport} />
                </div>
                <Link href={route('bonPays.create')}>
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Input Pembayaran
                    </Button>
                </Link>
            </div>
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
