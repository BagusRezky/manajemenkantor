/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, } from '@/types';
import { MasterCoa } from '@/types/masterCoa';
import { Head, useForm } from '@inertiajs/react';
import { Banknote, FileText, ShoppingCart, TrendingUp } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Reports', href: '/reports' }];

interface ReportCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    routeName: string;
    buttonColor: string;
    accounts?: MasterCoa[]; 
    showAccountSelect?: boolean;
}

const ReportCard = ({ title, description, icon: Icon, routeName, buttonColor, accounts = [], showAccountSelect = false }: ReportCardProps) => {
    // Inisialisasi form dengan tambahan id_account
    const { data, setData, processing } = useForm({
        start_date: '',
        end_date: '',
        id_account: '',
    });

    const handleExport = (e: React.FormEvent) => {
        e.preventDefault();

        // Membentuk query params secara manual untuk redirect browser (karena Excel download)
        const params: any = {
            start_date: data.start_date,
            end_date: data.end_date,
        };

        // Jika ini laporan mutasi, sertakan id_account
        if (showAccountSelect) {
            params.id_account = data.id_account;
        }

        const url = route(routeName, params);
        window.location.href = url;
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
                {/* Field Khusus untuk Laporan Mutasi: Pilih Akun */}
                {showAccountSelect && (
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase">Pilih Akun / COA</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.id_account}
                            onChange={(e) => setData('id_account', e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Akun --</option>
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.kode_akuntansi} - {acc.nama_akun}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

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

                <button
                    type="submit"
                    disabled={processing}
                    className={`w-full rounded-md px-4 py-2 font-medium text-white transition-colors ${buttonColor} hover:opacity-90 disabled:bg-gray-400`}
                >
                    {processing ? 'Processing...' : 'Export Excel'}
                </button>
            </form>
        </div>
    );
};

// Interface untuk data yang diterima dari Controller
interface ReportsProps {
    accounts: MasterCoa[];
}

export default function Reports({ accounts }: ReportsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Sistem" />

            <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Report Mutasi - Sekarang dengan Dropdown Akun */}
                    <ReportCard
                        title="Laporan Mutasi"
                        description="Rekapitulasi Debet & Kredit per Akun/COA."
                        icon={TrendingUp}
                        routeName="mutationReports.export"
                        buttonColor="bg-blue-600"
                        showAccountSelect={true}
                        accounts={accounts}
                    />

                    {/* Report Payment */}
                    <ReportCard
                        title="Laporan Pembayaran"
                        description="Download data transaksi pembayaran."
                        icon={Banknote}
                        routeName="paymentReports.export"
                        buttonColor="bg-green-600"
                    />

                    {/* Report Penjualan */}
                    <ReportCard
                        title="Laporan Penjualan"
                        description="Data detail item yang terjual ke customer."
                        icon={ShoppingCart}
                        routeName="salesReports.export"
                        buttonColor="bg-purple-600"
                    />

                    {/* Report Laba Rugi */}
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
