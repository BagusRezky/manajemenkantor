import { Button } from '@/components/ui/button';
import { CardContent, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Gaji } from '@/types/gaji';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { DataTable } from './table/data-table';
import { columns } from './table/columns';

const breadcrumbs = [{ title: 'Rekap Gaji', href: route('gajis.index') }];

interface Props {
    rekap: Gaji[];
    bulan: string;
    tahun: string;
}

export default function Gajis({ rekap, bulan, tahun }: Props) {
    const [filter, setFilter] = useState({
        bulan,
        tahun,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [range, setRange] = useState({ start_date: '', end_date: '' });

    const handleSendAll = () => {
        router.post(route('gajis.sendSlip'), range, {
            onSuccess: () => setIsModalOpen(false),
        });
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('gajis.index'), filter, { preserveState: true });
    };

    const bulanList = [
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Gaji" />

                <div className="p-5 flex items-center justify-between">
                    <CardTitle>Rekapitulasi Gaji Karyawan</CardTitle>
                    <Button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white hover:bg-green-700">
                        Kirim Semua Slip Gaji
                    </Button>
                </div>

                {/* Modal Sederhana (Ganti dengan Komponen UI Anda) */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-96 rounded-lg bg-white p-6">
                            <h3 className="mb-4 text-lg font-bold">Pilih Range Tanggal</h3>
                            <div className="space-y-4">
                                <input
                                    type="date"
                                    className="w-full rounded border p-2"
                                    onChange={(e) => setRange({ ...range, start_date: e.target.value })}
                                />
                                <input
                                    type="date"
                                    className="w-full rounded border p-2"
                                    onChange={(e) => setRange({ ...range, end_date: e.target.value })}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button onClick={handleSendAll}>Kirim Sekarang</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <CardContent>
                    {/* Filter Bulan & Tahun */}
                    <form onSubmit={handleFilter} className="mb-4 flex flex-wrap items-end gap-3">
                        <div>
                            <label className="text-sm font-medium">Bulan</label>
                            <select
                                value={filter.bulan}
                                onChange={(e) => setFilter({ ...filter, bulan: e.target.value })}
                                className="ml-2 rounded-md border p-2"
                            >
                                {bulanList.map((b) => (
                                    <option key={b.value} value={b.value}>
                                        {b.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Tahun</label>
                            <input
                                type="number"
                                className="ml-2 w-28 rounded-md border p-2"
                                value={filter.tahun}
                                onChange={(e) => setFilter({ ...filter, tahun: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="ml-2">
                            Tampilkan
                        </Button>
                    </form>

                    {/* Data Tabel */}
                    <DataTable columns={columns} data={rekap} />
                </CardContent>

        </AppLayout>
    );
}
