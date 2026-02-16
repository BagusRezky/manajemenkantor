// resources\js\pages\poBilling\table\data-table.tsx
import { DataTablePagination } from '@/components/custom-pagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [importLoading, setImportLoading] = useState(false);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { columnFilters },
    });

    const handleImportSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setImportLoading(true);
        const formData = new FormData(e.currentTarget);

        router.post(route('poBillings.import'), formData, {
            onSuccess: () => {
                setIsImportOpen(false);
                setImportLoading(false);
                toast.success('Migrasi Berhasil!');
            },
            onError: (errors) => {
                setImportLoading(false);
                toast.error('Gagal import. Cek format file atau relasi data.');
                console.log(errors);
            },
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Cari No. Bukti..."
                    value={(table.getColumn('no_bukti_tagihan')?.getFilterValue() as string) ?? ''}
                    onChange={(e) => table.getColumn('no_bukti_tagihan')?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex space-x-2">
                    <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Upload className="mr-2 h-4 w-4" /> Import Migrasi
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleImportSubmit} className="space-y-4">
                                <DialogHeader>
                                    <DialogTitle>Import Data </DialogTitle>
                                    <DialogDescription>Pilih dua file sekaligus</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2">
                                    <Label>File Header</Label>
                                    <Input type="file" name="file_header" accept=".csv" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>File Detail</Label>
                                    <Input type="file" name="file_detail" accept=".csv" required />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={importLoading}>
                                        {importLoading ? 'Memproses...' : 'Mulai Import'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <Link href={route('poBillings.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Tambah
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-card rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((h) => (
                                    <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="py-4">
                <DataTablePagination table={table} />
            </div>
        </div>
    );
}
