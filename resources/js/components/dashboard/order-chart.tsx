/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

export default function OrderChart({ data }: { data: any[] }) {
    return (
        <Card className="overflow-hidden border-none bg-white shadow-xl dark:bg-neutral-900">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-neutral-700 dark:bg-neutral-800/50">
                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    Statistik Penjualan Bulanan
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <ChartContainer
                    config={{
                        total: { label: 'Total', color: '#4f46e5' },
                    }}
                    className="h-[260px] w-full"
                >
                    <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                            tickFormatter={(v) => v.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent className="border-none bg-white shadow-xl" />} />
                        <Bar dataKey="total" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
