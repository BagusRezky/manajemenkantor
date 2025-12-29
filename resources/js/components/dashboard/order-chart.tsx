/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

interface OrderChartProps {
    data: any[];
    dataKey: string;
    title: string;
    color: string;
}

export default function OrderChart({ data, dataKey, title, color }: OrderChartProps) {
    return (
        <Card className="overflow-hidden border-none bg-white shadow-xl dark:bg-neutral-900">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-neutral-700 dark:bg-neutral-800/50">
                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <ChartContainer
                    config={{
                        [dataKey]: { label: title, color: color },
                    }}
                    className="h-[260px] w-full"
                >
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                            tickFormatter={(v) => v.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent className="border-none bg-white shadow-xl" />} />
                        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} barSize={35} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
