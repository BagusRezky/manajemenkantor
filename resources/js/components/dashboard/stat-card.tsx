import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    colorClass: string; // Background ikon
    accentColor: string; // Warna border samping
}

export default function StatCard({ title, value, icon, colorClass, accentColor }: StatCardProps) {
    const formatAbbreviation = (num: number) => {
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + ' BIO';
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + ' MIO';
        return new Intl.NumberFormat('id-ID').format(num);
    };

    return (
        <Card className={`relative overflow-hidden border-l-4 border-none bg-white shadow-lg dark:bg-neutral-900 ${accentColor}`}>
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">{title}</p>
                        <h3 className="mt-1 text-2xl font-black text-slate-800 dark:text-white">{formatAbbreviation(value)}</h3>
                    </div>
                    <div className={`${colorClass} rounded-xl p-3 shadow-lg shadow-current/20`}>{icon}</div>
                </div>
            </CardContent>
        </Card>
    );
}
