import { Button } from '@/components/ui/button';
import { CardContent, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Gaji } from '@/types/gaji';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs = [{ title: 'Rekap Gaji', href: route('gajis.index') }];

interface Props {
    rekap: Gaji[];
    filters: { start_date: string; end_date: string };
}

export default function Gajis({ rekap, filters }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Gunakan filter dari backend sebagai default range kirim slip
    const [range, setRange] = useState({
        start_date: filters.start_date,
        end_date: filters.end_date,
    });

    const handleSendAll = () => {
        router.post(route('gajis.sendSlip'), range, {
            onSuccess: () => setIsModalOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekap Gaji" />

            <div className="flex items-center justify-between p-5">
                <CardTitle>Rekapitulasi Gaji Karyawan</CardTitle>
                <Button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                    Kirim Semua Slip Gaji
                </Button>
            </div>

            {/* Modal remains here for sending emails */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-slate-800">Kirim Slip Gaji (Range)</h3>
                        <div className="space-y-4">
                            <input
                                type="date"
                                value={range.start_date}
                                className="w-full rounded border p-2"
                                onChange={(e) => setRange({ ...range, start_date: e.target.value })}
                            />
                            <input
                                type="date"
                                value={range.end_date}
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
                <DataTable columns={columns} data={rekap} filters={filters} />
            </CardContent>
        </AppLayout>
    );
}
