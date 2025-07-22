// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BaggageClaim, BoxIcon, CandlestickChartIcon, ClipboardList, ContainerIcon, CuboidIcon, LayoutGrid, Mailbox, MailsIcon, PanelTopOpen, Paperclip, Printer, ScrollIcon, StickyNote, StretchHorizontalIcon, Users, Users2Icon, WarehouseIcon } from 'lucide-react';
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
                icon: Users2Icon,
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
        icon: Mailbox,
        children: [
            {
                title: 'Surat Perintah Kerja',
                icon: MailsIcon,
                href: '/kartuInstruksiKerja',
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
                title: 'Mesin Printing',
                icon: PanelTopOpen,
                href: '/mesins',
            },
            {
                title: 'Operator Printing',
                icon: Users,
                href: '/operators',
            },

            {
                title: 'IMR Printing',
                icon: Paperclip,
                href: '/internalMaterialRequests',
            },
        ],
    },
    {
        title: 'DIE MAKING',
        icon: ScrollIcon,
        children: [
            {
                title: 'Die Making',
                icon: ScrollIcon,
                href: '/dieMakings',
            },
            {
                title: 'Mesin Die Making',
                icon: PanelTopOpen,
                href: '/mesinDiemakings',
            },
            {
                title: 'Operator Die Making',
                icon: Users,
                href: '/operatorDiemakings',
            },
            {
                title: 'IMR Die Making',
                icon: Paperclip,
                href: '/imrDiemakings',
            },
        ],
    },
    {
        title: 'WAREHOUSE',
        icon: WarehouseIcon,
        children: [
            {
                title: 'Penerimaan Barang',
                icon: CuboidIcon,
                href: '/penerimaanBarangs',
            },
            {
                title: 'Material Stock',
                icon: CandlestickChartIcon,
                href: '/materialStocks',
            },
        ],
    },
    {
        title: 'FINISHING',
        icon: ScrollIcon,
        children: [
            {
                title: 'Packaging',
                icon: BoxIcon,
                href: '/packagings',
            },
            {
                title: 'Finishing',
                icon: ScrollIcon,
                href: '/finishings',
            },
            {
                title: 'Mesin Finish',
                icon: PanelTopOpen,
                href: '/mesinFinishings',
            },
            {
                title: 'Operator Finish',
                icon: Users,
                href: '/operatorFinishings',
            },
            {
                title: 'IMR Finish',
                icon: Paperclip,
                href: '/imrFinishings',
            },
        ],
    },
    {
        title: 'DISPATCH',
        icon: Users,
        children: [
            {
                title: 'Surat Jalan',
                icon: MailsIcon,
                href: '/suratJalans',
            },
            {
                title: 'Blokir',
                icon: Users,
                href: '/blokirs',
            },
        ],
    },
    {
        title: 'FINANCE',
        icon: StickyNote,
        children: [
            {
                title: 'Invoice',
                icon: StickyNote,
                href: '/invoices',
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
