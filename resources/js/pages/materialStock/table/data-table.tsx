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

    // Calculate summary statistics
    // const materialStocks = data as MaterialStock[];
    // const totalItems = materialStocks.length;
    // const normalStock = materialStocks.filter((item) => item.status === 'normal').length;
    // const lowStock = materialStocks.filter((item) => item.status === 'low_stock').length;
    // const outOfStock = materialStocks.filter((item) => item.status === 'out_of_stock').length;
    // const totalOnhand = materialStocks.reduce((sum, item) => sum + item.onhand_stock, 0);
    // const totalAllocation = materialStocks.reduce((sum, item) => sum + item.allocation_stock, 0);

    return (
        <div className="space-y-6">
            {/* Summary Cards
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="text-2xl font-bold">{totalItems}</p>
                                <p className="text-sm text-gray-600">Total Items</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="text-2xl font-bold text-green-600">{normalStock}</p>
                                <p className="text-sm text-gray-600">Normal Stock</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-8 w-8 text-yellow-500" />
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">{lowStock}</p>
                                <p className="text-sm text-gray-600">Low Stock</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <TrendingDown className="h-8 w-8 text-red-500" />
                            <div>
                                <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
                                <p className="text-sm text-gray-600">Out of Stock</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div> */}

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
                    {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="low_stock">Low Stock</SelectItem>
                            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                        </SelectContent>
                    </Select> */}
                </div>

                {/* <div className="flex items-center space-x-2">
                    <Badge variant="outline">{table.getFilteredRowModel().rows.length} items</Badge>
                </div> */}
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
