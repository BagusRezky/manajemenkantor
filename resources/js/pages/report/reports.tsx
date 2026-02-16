/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { MasterCoa } from '@/types/masterCoa';
import { Head, useForm } from '@inertiajs/react';
import { Banknote, FileText, Search, ShoppingCart, TrendingUp, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Reports', href: '/reports' }];

interface ReportCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    routeName: string;
    buttonColor: string;
    accounts?: MasterCoa[];
    isMutation?: boolean;
}

const ReportCard = ({ title, description, icon: Icon, routeName, buttonColor, accounts = [], isMutation = false }: ReportCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, processing } = useForm({
        start_date: '',
        end_date: '',
        selected_accounts: [] as string[], // Array untuk multiple IDs
    });

    // Filter akun berdasarkan pencarian
    const filteredAccounts = useMemo(() => {
        return accounts.filter(
            (acc) =>
                acc.nama_akun.toLowerCase().includes(searchTerm.toLowerCase()) || acc.kode_akuntansi.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [accounts, searchTerm]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setData(
                'selected_accounts',
                filteredAccounts.map((acc) => acc.id.toString()),
            );
        } else {
            setData('selected_accounts', []);
        }
    };

    const handleCheckboxChange = (id: string) => {
        const current = [...data.selected_accounts];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('selected_accounts', current);
    };

    const handleExport = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.start_date || !data.end_date) return alert('Pilih tanggal!');
        if (isMutation && data.selected_accounts.length === 0) return alert('Pilih minimal satu akun!');

        const params = new URLSearchParams();
        params.append('start_date', data.start_date);
        params.append('end_date', data.end_date);

        if (isMutation) {
            data.selected_accounts.forEach((id) => params.append('id_accounts[]', id));
            setIsModalOpen(false);
        }
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
                        <label className="text-xs font-semibold text-gray-400 uppercase">Dari</label>
                        <input
                            type="date"
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase">Sampai</label>
                        <input
                            type="date"
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                            required
                        />
                    </div>
                </div>

                {isMutation ? (
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-white transition-colors ${buttonColor} hover:opacity-90`}
                    >
                        {data.selected_accounts.length > 0 ? `${data.selected_accounts.length} Akun Terpilih` : 'Pilih Akun & Export'}
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full rounded-md px-4 py-2 font-medium text-white transition-colors ${buttonColor} hover:opacity-90 disabled:bg-gray-400`}
                    >
                        {processing ? 'Processing...' : 'Export Excel'}
                    </button>
                )}
            </form>

            {/* Modal Pemilihan Akun (Hanya untuk Mutasi) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b p-4">
                            <h3 className="font-bold text-gray-800">Pilih Akun Mutasi</h3>
                            <button onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="relative mb-4">
                                <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari kode atau nama akun..."
                                    className="w-full rounded-md border-gray-300 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="mb-2 flex items-center justify-between px-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600"
                                        onChange={handleSelectAll}
                                        checked={data.selected_accounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                                    />
                                    Pilih Semua
                                </label>
                                <span className="text-xs text-gray-400">{filteredAccounts.length} Akun ditemukan</span>
                            </div>

                            <div className="max-h-60 overflow-y-auto rounded-md border border-gray-100 bg-gray-50 p-2">
                                {filteredAccounts.map((acc) => (
                                    <label key={acc.id} className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-white">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600"
                                            checked={data.selected_accounts.includes(acc.id.toString())}
                                            onChange={() => handleCheckboxChange(acc.id.toString())}
                                        />
                                        <div className="text-sm">
                                            <span className="font-mono font-bold text-blue-600">{acc.kode_akuntansi}</span>
                                            <span className="ml-2 text-gray-700">{acc.nama_akun}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 border-t p-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleExport}
                                className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Export ({data.selected_accounts.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface ReportsProps {
    accounts: MasterCoa[];
}

export default function Reports({ accounts }: ReportsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Sistem" />

            <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <ReportCard
                        title="Laporan Mutasi"
                        description="Rekapitulasi Debet & Kredit multiple Akun/COA."
                        icon={TrendingUp}
                        routeName="mutationReports.export"
                        buttonColor="bg-blue-600"
                        isMutation={true}
                        accounts={accounts}
                    />

                    <ReportCard
                        title="Laporan Pembayaran"
                        description="Download data transaksi pembayaran."
                        icon={Banknote}
                        routeName="paymentReports.export"
                        buttonColor="bg-green-600"
                    />

                    <ReportCard
                        title="Laporan Penjualan"
                        description="Data detail item yang terjual ke customer."
                        icon={ShoppingCart}
                        routeName="salesReports.export"
                        buttonColor="bg-purple-600"
                    />

                    <ReportCard
                        title="Laporan Laba Rugi"
                        description="Perhitungan selisih pendapatan dan beban."
                        icon={FileText}
                        routeName="profitlossReports.export"
                        buttonColor="bg-orange-600"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
