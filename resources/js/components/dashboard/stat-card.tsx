import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    description?: string;
}

export default function StatCard({ title, value, icon, description }: StatCardProps) {
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatted}</div>
                {description && <p className="text-muted-foreground mt-1 text-xs">{description}</p>}
            </CardContent>
        </Card>
    );
}
