/* eslint-disable @typescript-eslint/no-explicit-any */
// resources/js/pages/dashboard.tsx

import OrderChart from '@/components/dashboard/order-chart';
import StatCard from '@/components/dashboard/stat-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ShoppingBag, Truck } from 'lucide-react';

interface DashboardProps {
    totalOrderValue: number;
    totalKirimValue: number;
    chartData: any[];
    selectedYear: number;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard({ totalOrderValue, totalKirimValue, chartData, selectedYear }: DashboardProps) {
    const handleYearChange = (value: string) => {
        router.get('/dashboard', { year: value }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* Tambahkan bg-slate-50/50 untuk memberi tekstur pada background */}
            <div className="min-h-[calc(100vh-64px)] space-y-6 bg-slate-50/50 p-6 dark:bg-neutral-950">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-neutral-100">
                            Business Overview <span className="text-indigo-600">.</span>
                        </h2>
                        <p className="text-muted-foreground text-xs font-medium">Monitoring performa tahun {selectedYear}</p>
                    </div>

                    <Select onValueChange={handleYearChange} defaultValue={selectedYear.toString()}>
                        <SelectTrigger className="w-[120px] border-none bg-white font-bold shadow-md dark:bg-neutral-900">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[2024, 2025, 2026].map((y) => (
                                <SelectItem key={y} value={y.toString()}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
                    {/* Stat Cards - Dibuat lebih ramping */}
                    <div className="flex flex-col gap-4 lg:col-span-1">
                        <StatCard
                            title="Total Order"
                            value={totalOrderValue}
                            colorClass="bg-indigo-600 text-white"
                            accentColor="border-indigo-500"
                            icon={<ShoppingBag className="h-5 w-5" />}
                        />
                        <StatCard
                            title="Total Kirim"
                            value={totalKirimValue}
                            colorClass="bg-orange-500 text-white"
                            accentColor="border-orange-500"
                            icon={<Truck className="h-5 w-5" />}
                        />
                    </div>

                    {/* Grafik dengan area lebih luas */}
                    <div className="lg:col-span-3">
                        <OrderChart data={chartData} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
