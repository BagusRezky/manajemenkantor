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

            <div className="flex flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Dashboard</h2>

                    </div>

                    <Select onValueChange={handleYearChange} defaultValue={selectedYear.toString()}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Tahun" />
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

                {/* Stat Cards - Berdampingan */}
                <div className="grid gap-4 md:grid-cols-2">
                    <StatCard
                        title="Jumlah Total Order"
                        value={totalOrderValue}
                        icon={<ShoppingBag className="h-4 w-4" />}
                        description="Estimasi total dari pesanan masuk"
                    />
                    <StatCard
                        title="Total Kirim"
                        value={totalKirimValue}
                        icon={<Truck className="h-4 w-4" />}
                        description="Total invoice yang terbit"
                    />
                </div>

                {/* Grafik Utama */}
                <div className="w-full">
                    <OrderChart data={chartData} />
                </div>
            </div>
        </AppLayout>
    );
}
