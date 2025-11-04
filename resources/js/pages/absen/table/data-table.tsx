import { DataTablePagination } from '@/components/custom-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Absen } from '@/types/absen';
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
    absens: Absen[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { columnFilters },
    });

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        router.post(route('absens.import'), formData, {
            onSuccess: () => {
                e.target.value = ''; // reset input
                toast.success('File berhasil diimpor!');
            },
            onError: () => {
                toast.error('Gagal mengimpor file.');
            },
        });
    };

    return (
        <div>
            <div className="flex justify-between py-4">
                <Input
                    placeholder="Cari Nama Karyawan..."
                    value={(table.getColumn('nama')?.getFilterValue() as string) ?? ''}
                    onChange={(e) => table.getColumn('nama')?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
                <div className="ml-auto flex space-x-6">
                    {/* Ganti route & teks tombol */}
                    <Link href={route('absens.rekap')}>
                        <Button>Rekap Absen</Button>
                    </Link>

                    <Link href={route('absens.create')}>
                        <Button>Tambah Absen</Button>
                    </Link>

                    <Button onClick={() => document.getElementById('excel-upload')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Excel
                    </Button>
                    <input id="excel-upload" type="file" name="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
                </div>
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
