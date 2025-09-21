/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/nav-dropdown.tsx

import { NavItemType, NavItemWithChildren } from '@/types'; // <-- Import dari index.d.ts
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from './ui/sidebar';

// Helper type guard
function hasChildren(item: NavItemType): item is NavItemWithChildren {
    return !!(item as NavItemWithChildren).children?.length;
}

const STORAGE_KEY = 'open_dropdown_items';

function getOpenItems() {
    try {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        return storedItems ? JSON.parse(storedItems) : {};
    } catch (error) {
        console.error('Error reading localStorage:', error);
        return {};
    }
}

function saveOpenItems(openItems: any) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(openItems));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// --- Komponen Dropdown Item (Internal) ---
function DropdownMenuItem({ item, hasPermission }: { item: NavItemWithChildren; hasPermission: (permission?: string | null) => boolean }) {
    const page = usePage();
    const itemTitle = item.title || '';

    // Saring children berdasarkan permission
    const visibleChildren = item.children?.filter((child) => hasPermission(child.permission));

    // Jika tidak ada anak yang bisa dilihat, jangan render item ini
    if (!visibleChildren || visibleChildren.length === 0) {
        return null;
    }

    const isChildActive = visibleChildren.some((child) => child.href === page.url);

    const [isOpen, setIsOpen] = useState(() => {
        const openItems = getOpenItems();
        if (itemTitle in openItems) return openItems[itemTitle];
        return isChildActive;
    });

    const toggleDropdown = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        const updatedOpenItems = { ...getOpenItems(), [itemTitle]: newState };
        saveOpenItems(updatedOpenItems);
    };

    useEffect(() => {
        if (isChildActive && !isOpen) {
            setIsOpen(true);
        }
    }, [isChildActive, isOpen]);

    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton onClick={toggleDropdown} isActive={isChildActive}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {isOpen ? <ChevronDown className="ml-auto h-4 w-4" /> : <ChevronRight className="ml-auto h-4 w-4" />}
            </SidebarMenuButton>

            {isOpen && (
                <SidebarMenuSub>
                    {visibleChildren.map((child) => (
                        <SidebarMenuSubItem key={child.title}>
                            <SidebarMenuSubButton asChild isActive={child.href === page.url}>
                                <Link href={child.href || '#'} preserveState>
                                    {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                                    <span>{child.title}</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
            )}
        </SidebarMenuItem>
    );
}

// --- Komponen NavDropdown Utama ---
export function NavDropdown({ items = [] }: { items: NavItemType[] }) {
    const { auth } = usePage().props as unknown as { auth: { user: { roles?: string[]; permissions?: string[] } } };
    const userRoles = auth.user?.roles || [];
    const userPermissions = auth.user?.permissions || [];

    // Fungsi pengecekan hak akses
    const hasPermission = (permission?: string | null): boolean => {
        if (!permission) return true; // Jika tidak ada permission, selalu tampilkan
        return userRoles.includes('admin') || userPermissions.includes(permission);
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    if (hasChildren(item)) {
                        return <DropdownMenuItem key={item.title} item={item} hasPermission={hasPermission} />;
                    }

                    // Item biasa (non-dropdown) juga perlu dicek
                    if (!hasPermission(item.permission)) {
                        return null;
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.href === usePage().url}>
                                <Link href={item.href || '#'} preserveState>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
