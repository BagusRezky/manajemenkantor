import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { RekapPinjaman } from '@/types/rekap';
import { columns } from './table/rekap/columns';
import { DataTable } from './table/rekap/data-table';

// Ganti breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pembayaran Pinjaman',
        href: route('pembayaranPinjamans.index'),
    },
    {
        title: 'Rekap',
        href: route('pembayaranPinjamans.rekap'),
    },
];

// Ganti props
export default function PembayaranPinjamans({ pembayaranPinjamans }: { pembayaranPinjamans: RekapPinjaman[] }) {
    const [data, setData] = useState<RekapPinjaman[]>([]);

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
