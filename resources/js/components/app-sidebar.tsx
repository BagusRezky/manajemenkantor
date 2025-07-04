// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BaggageClaim, ClipboardList, ContainerIcon, LayoutGrid, PanelTopOpen, Paperclip, Printer, StretchHorizontalIcon, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { NavDropdown, NavItemWithChildren } from './nav-dropdown';

const mainNavItems: NavItem[] = [
    {
        title: 'DASHBOARD',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

export const dropdownNavItems: NavItemWithChildren[] = [
    {
        title: 'MARKETING',
        icon: BaggageClaim,
        children: [
            {
                title: 'Finish Good Item',
                icon: BaggageClaim,
                href: '/finishGoodItems',
            },
            {
                title: 'Master Customer',
                icon: BaggageClaim,
                href: '/customerAddresses',
            },
            {
                title: 'Sales Order',
                icon: BaggageClaim,
                href: '/salesOrders',
            },
        ],
    },
    {
        title: 'PURCHASE',
        icon: ClipboardList,
        children: [
            {
                title: 'Purchase Request',
                icon: ClipboardList,
                href: '/purchaseRequest',
            },
            {
                title: 'Purchase Order',
                icon: ClipboardList,
                href: '/purchaseOrders',
            },
            {
                title: 'Master Item',
                icon: StretchHorizontalIcon,
                href: '/masterItems',
            },
            {
                title: 'Master Item Category',
                icon: ContainerIcon,
                href: '/categoryItems',
            },
            {
                title: 'Master Suplier',
                icon: ContainerIcon,
                href: '/suppliers',
            },
            {
                title: 'Master Satuan',
                icon: ContainerIcon,
                href: '/units',
            },
            {
                title: 'Master Type Item',
                icon: ContainerIcon,
                href: '/typeItems',
            },
            {
                title: 'Master Conversi Unit',
                icon: ContainerIcon,
                href: '/masterKonversis',
            },
            {
                title: 'External Return',
                icon: ContainerIcon,
                href: '/returEksternals',
            },
        ],
    },
    {
        title: 'PPIC',
        icon: Users,
        children: [
            {
                title: 'Surat Perintah Kerja',
                icon: Users,
                href: '/kartuInstruksiKerja',
            },
        ],
    },
    {
        title: 'DIE MAKING',
        icon: Users,
        children: [
            {
                title: 'Die Making',
                icon: Users,
                href: '/dieMakings',
            },
        ],
    },
    {
        title: 'PRINTING',
        icon: Printer,
        children: [
            {
                title: 'Printing',
                icon: Printer,
                href: '/printings',
            },
            {
                title: 'Manajemen Mesin',
                icon: PanelTopOpen,
                href: '/mesins',
            },
            {
                title: 'Operator',
                icon: Users,
                href: '/operators',
            },

            {
                title: 'IMR',
                icon: Paperclip,
                href: '/internalMaterialRequests',
            },
        ],
    },
    {
        title: 'WAREHOUSE',
        icon: Users,
        children: [
            {
                title: 'Penerimaan Barang',
                icon: Users,
                href: '/penerimaanBarangs',
            },
            {
                title: 'Material Stock',
                icon: Users,
                href: '/materialStocks',
            },
        ],
    },
    {
        title: 'DELIVERY ORDER',
        icon: Users,
        children: [
            {
                title: 'Members',
                icon: Users,
                href: '/team/members',
            },
        ],
    },
    {
        title: 'FINANCE',
        icon: Users,
        children: [
            {
                title: 'Members',
                icon: Users,
                href: '/team/members',
            },
        ],
    },
    {
        title: 'HRD',
        icon: Users,
        children: [
            {
                title: 'Departemen',
                icon: Users,
                href: '/departemens',
            },
        ],
    },
    {
        title: 'REPORT',
        icon: Users,
        children: [
            {
                title: 'Members',
                icon: Users,
                href: '/team/members',
            },
        ],
    },
];


export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
                <NavDropdown items={dropdownNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
