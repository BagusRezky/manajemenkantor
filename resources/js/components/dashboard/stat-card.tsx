import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    description?: string;
    isCurrency?: boolean; // Props baru untuk kontrol format
}

export default function StatCard({
    title,
    value,
    icon,
    description,
    isCurrency = true, // Default tetap pakai format mata uang
}: StatCardProps) {
    // Logika pemformatan
    const formatted = isCurrency
        ? new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0,
          }).format(value)
        : new Intl.NumberFormat('id-ID').format(value); // Hanya format ribuan (1.000)

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
