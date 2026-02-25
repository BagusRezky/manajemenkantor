import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Printer } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Laporan PO VS PB', href: '/reportPoPbs' }];

interface ReportCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    routeName: string;
    buttonColor: string;
}

const ReportCard = ({ title, description, icon: Icon, routeName, buttonColor }: ReportCardProps) => {
    const { data, setData, processing } = useForm({
        start_date: '',
        end_date: '',
    });

    const handleExport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.start_date || !data.end_date) return alert('Pilih rentang tanggal!');

        const params = new URLSearchParams({
            start_date: data.start_date,
            end_date: data.end_date,
        });


        window.location.href = `${route(routeName)}?${params.toString()}`;
    };

    return (
        <div className="flex h-full flex-col rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex items-center gap-3">
                <div className={`rounded-lg p-2 text-white ${buttonColor}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>

            <form onSubmit={handleExport} className="mt-auto space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Dari Tanggal</label>
                        <input
                            type="date"
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Sampai Tanggal</label>
                        <input
                            type="date"
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 font-semibold text-white transition-all ${buttonColor} hover:brightness-90 disabled:bg-gray-400`}
                >
                    <Calendar size={18} />
                    {processing ? 'Processing...' : 'Export PO VS PB (Excel)'}
                </button>
            </form>
        </div>
    );
};

export default function ReportPoPbs() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan PO VS PB" />

            <div className="p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Laporan PO VS PB</h1>
                    <p className="text-gray-500">Pilih rentang tanggal entri untuk mendownload rekapitulasi hasil PO VS PB.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* PO VS PB */}
                    <ReportCard
                        title="PO VS PB"
                        description="Rekapitulasi hasil PO VS PB."
                        icon={Printer}
                        routeName="reportPoPbs.exportPoPb"
                        buttonColor="bg-blue-600"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
