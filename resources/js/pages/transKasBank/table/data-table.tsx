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
import { ArrowDownCircle, ArrowUpCircle, Upload } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');

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
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        router.post(route('trans-kas-banks.import'), formData, {
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
            <div className="flex items-center">
                <Input
                    placeholder="Cari semua data"
                    value={table.getState().globalFilter ?? ''}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    className="max-w-sm shadow-sm"
                />
                <div className="ml-auto flex space-x-3">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('excel-upload-trans-kas-banks')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Excel
                    </Button>
                    {/* Input file yang disembunyikan */}
                    <input type="file" name="file" accept=".xlsx,.xls,.csv" id="excel-upload-trans-kas-banks" className="hidden" onChange={handleImport} />
                    <Link href={route('trans-kas-banks.create-masuk')}>
                        <Button variant="default" className="bg-green-600 hover:bg-green-700">
                            <ArrowUpCircle className="mr-2 h-4 w-4" /> Bank Masuk
                        </Button>
                    </Link>
                    <Link href={route('trans-kas-banks.create-keluar')}>
                        <Button variant="destructive">
                            <ArrowDownCircle className="mr-2 h-4 w-4" /> Bank Keluar
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="bg-card rounded-md border">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-foreground font-bold">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-muted-foreground h-24 text-center">
                                    Tidak ada transaksi ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
