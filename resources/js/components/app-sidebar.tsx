// components/app-sidebar.tsx

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavItem, NavItemWithChildren } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BaggageClaim,
    Banknote,
    BoxIcon,
    CandlestickChartIcon,
    ClipboardList,
    ContainerIcon,
    CuboidIcon,
    ExternalLinkIcon,
    FolderInputIcon,
    LayoutGrid,
    Mailbox,
    MailsIcon,
    PanelTopOpen,
    Paperclip,
    Printer,
    ScrollIcon,
    StickyNote,
    StretchHorizontalIcon,
    Users,
    Users2Icon,
    WarehouseIcon,
} from 'lucide-react';
import AppLogo from './app-logo';
import { NavDropdown } from './nav-dropdown';

// --- DATA MENU UTAMA ---
const mainNavItems: NavItem[] = [
    {
        title: 'DASHBOARD',
        href: '/dashboard',
        icon: LayoutGrid,
        permission: null, // bisa diakses semua user yang login
    },
];

// --- DATA MENU DROPDOWN (LENGKAP DENGAN PERMISSION) ---
export const dropdownNavItems: NavItemWithChildren[] = [
    {
        title: 'MARKETING',
        icon: BaggageClaim,
        children: [
            { title: 'Finish Good Item', icon: BaggageClaim, href: '/finishGoodItems', permission: 'finishGoodItems.index' },
            { title: 'Master Customer', icon: Users2Icon, href: '/customerAddresses', permission: 'customerAddresses.index' },
            { title: 'Sales Order', icon: BaggageClaim, href: '/salesOrders', permission: 'salesOrders.index' },
        ],
    },
    {
        title: 'PURCHASE',
        icon: ClipboardList,
        children: [
            { title: 'Purchase Request', icon: ClipboardList, href: '/purchaseRequest', permission: 'purchaseRequest.index' },
            { title: 'Purchase Order', icon: ClipboardList, href: '/purchaseOrders', permission: 'purchaseOrders.index' },
            { title: 'Master Item', icon: StretchHorizontalIcon, href: '/masterItems', permission: 'master-items.index' },
            { title: 'Master Item Category', icon: ContainerIcon, href: '/categoryItems', permission: 'categoryItems.index' },
            { title: 'Master Suplier', icon: ContainerIcon, href: '/suppliers', permission: 'suppliers.index' },
            { title: 'Master Satuan', icon: ContainerIcon, href: '/units', permission: 'units.index' },
            { title: 'Master Type Item', icon: ContainerIcon, href: '/typeItems', permission: 'typeItems.index' },
            { title: 'Master Conversi Unit', icon: ContainerIcon, href: '/masterKonversis', permission: 'masterKonversis.index' },
            { title: 'External Return', icon: ContainerIcon, href: '/returEksternals', permission: 'returEksternals.index' },
            { title: 'Internal Return', icon: ContainerIcon, href: '/returInternals', permission: 'returInternals.index' },
        ],
    },
    {
        title: 'SUBCOUNT',
        icon: ExternalLinkIcon,
        children: [
            { title: 'Subcount Out', icon: ExternalLinkIcon, href: '/subcountOuts', permission: 'subcountOuts.index' },
            { title: 'Subcount In', icon: FolderInputIcon, href: '/subcountIns', permission: 'subcountIns.index' },
        ],
    },
    {
        title: 'PPIC',
        icon: Mailbox,
        children: [{ title: 'Surat Perintah Kerja', icon: MailsIcon, href: '/kartuInstruksiKerja', permission: 'kartuInstruksiKerja.index' }],
    },
    {
        title: 'PRINTING',
        icon: Printer,
        children: [
            { title: 'Printing', icon: Printer, href: '/printings', permission: 'printings.index' },
            { title: 'Mesin Printing', icon: PanelTopOpen, href: '/mesins', permission: 'mesins.index' },
            { title: 'Operator Printing', icon: Users, href: '/operators', permission: 'operators.index' },
            { title: 'IMR Printing', icon: Paperclip, href: '/internalMaterialRequests', permission: 'internalMaterialRequests.index' },
        ],
    },
    {
        title: 'DIE MAKING',
        icon: ScrollIcon,
        children: [
            { title: 'Die Making', icon: ScrollIcon, href: '/dieMakings', permission: 'dieMakings.index' },
            { title: 'Mesin Die Making', icon: PanelTopOpen, href: '/mesinDiemakings', permission: 'mesinDiemakings.index' },
            { title: 'Operator Die Making', icon: Users, href: '/operatorDiemakings', permission: 'operatorDiemakings.index' },
            { title: 'IMR Die Making', icon: Paperclip, href: '/imrDiemakings', permission: 'imrDiemakings.index' },
        ],
    },
    {
        title: 'WAREHOUSE',
        icon: WarehouseIcon,
        children: [
            { title: 'Penerimaan Barang', icon: CuboidIcon, href: '/penerimaanBarangs', permission: 'penerimaanBarangs.index' },
            { title: 'Material Stock', icon: CandlestickChartIcon, href: '/materialStocks', permission: 'materialStocks.index' },
        ],
    },
    {
        title: 'FINISHING',
        icon: ScrollIcon,
        children: [
            { title: 'Packaging', icon: BoxIcon, href: '/packagings', permission: 'packagings.index' },
            { title: 'Finishing', icon: ScrollIcon, href: '/finishings', permission: 'finishings.index' },
            { title: 'Mesin Finish', icon: PanelTopOpen, href: '/mesinFinishings', permission: 'mesinFinishings.index' },
            { title: 'Operator Finish', icon: Users, href: '/operatorFinishings', permission: 'operatorFinishings.index' },
            { title: 'IMR Finish', icon: Paperclip, href: '/imrFinishings', permission: 'imrFinishings.index' },
        ],
    },
    {
        title: 'DISPATCH',
        icon: Users,
        children: [
            { title: 'Surat Jalan', icon: MailsIcon, href: '/suratJalans', permission: 'suratJalans.index' },
            { title: 'Blokir', icon: Users, href: '/blokirs', permission: 'blokirs.index' },
        ],
    },
    {
        title: 'FINANCE',
        icon: StickyNote,
        children: [
            { title: 'Invoice', icon: StickyNote, href: '/invoices', permission: 'invoices.index' },
            { title: 'Payment Entry Good', icon: Banknote, href: '/paymentEntryGoods', permission: 'paymentEntryGoods.index' },
        ],
    },
    {
        title: 'HRD',
        icon: Users,
        children: [
            { title: 'Departemen', icon: Users, href: '/departemens', permission: 'departemens.index' },
            { title: 'Karyawan', icon: Users, href: '/karyawans', permission: 'karyawans.index' },
            { title: 'Role Management', icon: Users, href: '/roles', permission: 'roles.index' },
            { title: 'Absensi', icon: Users, href: '/absens', permission: 'absens.index' },
            { title: 'Lembur', icon: Users, href: '/lemburs', permission: 'lemburs.index' },
            { title: 'Izin', icon: Users, href: '/izins', permission: 'izins.index' },
            { title: 'Pot. Tunjangan', icon: Users, href: '/potonganTunjangans', permission: 'potonganTunjangans.index' },
            { title: 'Bonus Karyawan', icon: Users, href: '/bonusKaryawans', permission: 'bonusKaryawans.index' },
            { title: 'Peng. Pinjaman', icon: Users, href: '/pengajuanPinjamans', permission: 'pengajuanPinjamans.index' },
        ],
    },
];

// --- KOMPONEN UTAMA APPSIDEBAR ---
export function AppSidebar() {
    const { auth } = usePage().props as unknown as { auth: { user: { roles?: string[]; permissions?: string[] } } };
    const user = auth.user;

    // Jangan render sidebar jika user tidak login
    if (!user) {
        return null;
    }

    // Fungsi untuk mengecek hak akses
    const hasPermission = (permission?: string | null): boolean => {
        if (!permission) return true; // Jika permission tidak diset, tampilkan
        const userRoles = user.roles || [];
        const userPermissions = user.permissions || [];
        // User dengan role 'admin' bisa melihat semua, atau user harus punya permission yang sesuai
        return userRoles.includes('admin') || userPermissions.includes(permission);
    };

    // Saring item menu utama berdasarkan hak akses
    const filteredMainNavItems = mainNavItems.filter((item) => hasPermission(item.permission));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* NavMain menerima item yang sudah disaring */}
                <NavMain items={filteredMainNavItems} />

                {/* NavDropdown menerima semua item, karena komponen ini akan menyaring sendiri secara internal */}
                <NavDropdown items={dropdownNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
