import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { PembayaranPinjaman } from '@/types/pembayaranPinjaman'; // Ganti
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

// Ganti breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pembayaran Pinjaman', href: '/pembayaranPinjamans' }];

// Ganti props
export default function PembayaranPinjamans({ pembayaranPinjamans }: { pembayaranPinjamans: PembayaranPinjaman[] }) {
    const [data, setData] = useState<PembayaranPinjaman[]>([]);

    useEffect(() => {
        // Ganti sumber data
        setData(pembayaranPinjamans);
    }, [pembayaranPinjamans]); // Ganti dependensi

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Ganti title */}
            <Head title="Pembayaran Pinjaman" />

            <div className="mx-5 py-5">
                {/* Ganti props */}
                <DataTable columns={columns()} data={data} pembayaranPinjamans={pembayaranPinjamans} />
            </div>
        </AppLayout>
    );
}
