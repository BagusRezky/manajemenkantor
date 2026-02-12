import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BonPay } from '@/types/bonPay';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

interface Props {
    bonPays: BonPay[];
}

export default function Index({ bonPays }: Props) {
    const breadcrumbs = [{ title: 'BonPay', href: '/bonPays' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Pembayaran (BonPay)" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Riwayat Pembayaran</h1>
                        <p className="text-muted-foreground text-sm">Kelola riwayat cicilan dan pelunasan invoice.</p>
                    </div>
                    <Link href={route('bonPays.create')}>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Input Pembayaran
                        </Button>
                    </Link>
                </div>
                <DataTable columns={columns} data={bonPays} />
            </div>
        </AppLayout>
    );
}
