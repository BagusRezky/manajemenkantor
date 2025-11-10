// pages/pengajuanPinjaman/pengajuanPinjamans.tsx

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { PengajuanPinjaman } from '@/types/pengajuanPinjaman';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengajuan Pinjaman', href: '/pengajuanPinjamans' }];

export default function PengajuanPinjamans({ pengajuanPinjamans }: { pengajuanPinjamans: PengajuanPinjaman[] }) {
    const [data, setData] = useState<PengajuanPinjaman[]>([]);

    useEffect(() => {
        setData(pengajuanPinjamans);
    }, [pengajuanPinjamans]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Pinjaman" />

            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>
        </AppLayout>
    );
}
