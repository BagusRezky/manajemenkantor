/* eslint-disable @typescript-eslint/no-explicit-any */
// resources/js/pages/dashboard.tsx

import OrderChart from '@/components/dashboard/order-chart';
import StatCard from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CalendarSearch, FileText, PackageCheck, Search, ShoppingBag, Truck } from 'lucide-react';
import { useState } from 'react';

interface DashboardProps {
    totalOrderValue: number;
    totalKirimValue: number;
    totalPOQty: number;
    totalLPBValue: number;
    chartData: any[];
    selectedYear: number;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard({ totalOrderValue, totalKirimValue, totalPOQty, totalLPBValue, chartData, selectedYear }: DashboardProps) {
    // State lokal untuk menampung input ketikan user
    const [yearInput, setYearInput] = useState(selectedYear.toString());

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Validasi sederhana: pastikan input adalah angka dan panjangnya 4 digit
        if (/^\d{4}$/.test(yearInput)) {
            router.get('/dashboard', { year: yearInput }, { preserveState: true, replace: true });
        } else {
            alert('Silahkan masukkan format tahun yang benar (Contoh: 2025)');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-[calc(100vh-64px)] space-y-6 bg-slate-50/50 p-6 dark:bg-neutral-950">
                {/* Header & Dynamic Filter Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-neutral-100">Dashboard</h2>
                        <p className="text-muted-foreground text-xs font-medium">Monitoring performa operasional tahun {selectedYear}</p>
                    </div>

                    {/* Input Tahun Dinamis */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="relative">
                            <CalendarSearch className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                type="number"
                                placeholder="Ketik Tahun..."
                                value={yearInput}
                                onChange={(e) => setYearInput(e.target.value)}
                                className="w-[150px] border-none bg-white pl-9 font-bold shadow-sm focus-visible:ring-indigo-500 dark:bg-neutral-900"
                            />
                        </div>
                        <Button type="submit" size="sm" className="bg-indigo-600 font-bold hover:bg-indigo-700">
                            <Search className="mr-2 h-4 w-4" />
                            Cari
                        </Button>
                    </form>
                </div>

                {/* Stat Cards Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Order "
                        value={totalOrderValue}
                        colorClass="bg-indigo-600 text-white"
                        accentColor="border-indigo-500"
                        icon={<ShoppingBag className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Total Kirim "
                        value={totalKirimValue}
                        colorClass="bg-orange-500 text-white"
                        accentColor="border-orange-500"
                        icon={<Truck className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Total PO"
                        value={totalPOQty}
                        colorClass="bg-emerald-600 text-white"
                        accentColor="border-emerald-500"
                        icon={<FileText className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Total PB"
                        value={totalLPBValue}
                        colorClass="bg-rose-500 text-white"
                        accentColor="border-rose-500"
                        icon={<PackageCheck className="h-5 w-5" />}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <OrderChart data={chartData} dataKey="salesTotal" title="Statistik Penjualan (IDR)" color="#4f46e5" />
                    <OrderChart data={chartData} dataKey="lpbTotal" title="Statistik Penerimaan Barang (IDR)" color="#f43f5e" />
                </div>
            </div>
        </AppLayout>
    );
}
