import { DataTablePagination } from '@/components/custom-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, router } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Upload } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

// Handler untuk proses impor
const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    // Asumsi route untuk impor master item adalah 'master-items.import'
    router.post(route('master-items.import'), formData, {
        onSuccess: () => {
            e.target.value = ''; // Reset input file
            toast.success('File Master Item berhasil diimpor!');
        },
        onError: (errors) => {
            e.target.value = ''; // Reset input file
            const errorMessage = errors.file ? `Gagal mengimpor file: ${errors.file}` : 'Gagal mengimpor file. Periksa format dan isi file.';
            toast.error(errorMessage);
        },
    });
};

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
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Cari Nama Item..."
                    value={(table.getColumn('nama_master_item')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('nama_master_item')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                {/* Bagian untuk Tombol Import dan Add New */}
                <div className="ml-auto flex space-x-3">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('excel-upload-master-item')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Excel
                    </Button>
                    {/* Input file yang disembunyikan */}
                    <input
                        type="file"
                        name="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        id="excel-upload-master-item"
                        onChange={handleImport}
                    />
                    <Link href={route('master-items.create')}>
                        <Button>Add New Master Item</Button>
                    </Link>
                </div>
            </div>
            <div className="rounded-md border-2 dark:border-0 dark:bg-violet-600">
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
