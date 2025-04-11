// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BaggageClaim, ClipboardList, ContainerIcon, LayoutGrid, StretchHorizontalIcon, Users } from 'lucide-react';
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
                title: 'Customer Address',
                icon: BaggageClaim,
                href: '/customerAddresses',
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
                href: '/team/members',
            },
            {
                title: 'Purchase Order',
                icon: ClipboardList,
                href: '/team/members',
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
                href: '/team/members',
            },
        ],
    },
    {
        title: 'PPIC',
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
        title: 'WAREHOUSE',
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
