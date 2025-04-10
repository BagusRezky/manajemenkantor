import { usePage, Link } from '@inertiajs/react';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarGroup,
    SidebarMenu,
} from './ui/sidebar';

export interface NavGrub {
    title?: string;
    href?: string;
    icon?: LucideIcon;
    disabled?: boolean;
}

// Extended interface for items with dropdowns
export interface NavItemWithChildren extends NavGrub {
    children?: NavGrub[];
}

// Type for all possible navigation items
export type NavItemType = NavGrub | NavItemWithChildren;

// Helper type guard to check if item has children
export function hasChildren(item: NavItemType): item is NavItemWithChildren {
    return !!(item as NavItemWithChildren).children?.length;
}

const STORAGE_KEY = 'open_dropdown_items';

function getOpenItems() {
    try {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        return storedItems ? JSON.parse(storedItems) : {};
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return {};
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveOpenItems(openItems: any) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(openItems));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

export function DropdownMenuItem({ item }: { item: NavItemWithChildren }) {
    const page = usePage();
    const openItems = getOpenItems();
    const itemTitle = item.title || '';

    // Check if any child is active
    const isChildActive = item.children?.some((child) => child.href === page.url);

    // Initialize state from localStorage first, then check if child is active
    // Only auto-open on initial render if a child is active
    const [isOpen, setIsOpen] = useState(() => {
        // If we have a stored value, use that
        if (itemTitle in openItems) {
            return openItems[itemTitle];
        }
        // Otherwise, auto-open only if a child is active
        return isChildActive;
    });

    // Toggle menu open/closed
    const toggleDropdown = () => {
        const newState = !isOpen;
        setIsOpen(newState);

        // Save the toggled state
        const updatedOpenItems = { ...getOpenItems(), [itemTitle]: newState };
        saveOpenItems(updatedOpenItems);
    };

    // Only run this effect once on mount to handle initial URL match
    useEffect(() => {
        // If a child is active and dropdown is closed, open it
        if (isChildActive && !isOpen) {
            setIsOpen(true);
            const updatedOpenItems = { ...getOpenItems(), [itemTitle]: true };
            saveOpenItems(updatedOpenItems);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array means this only runs once

    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton onClick={toggleDropdown} isActive={isChildActive}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {isOpen ? <ChevronDown className="ml-auto h-4 w-4" /> : <ChevronRight className="ml-auto h-4 w-4" />}
            </SidebarMenuButton>

            {isOpen && item.children && (
                <SidebarMenuSub>
                    {item.children.map((child) => (
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

// Navigation section with dropdown support
export function NavDropdown({ items = [] }: { items: NavItemType[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    // If the item has children, render it as a dropdown
                    if (hasChildren(item) && (item.children?.length ?? 0) > 0) {
                        return <DropdownMenuItem key={item.title} item={item} />;
                    }

                    // Otherwise render as a regular menu item
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.href === page.url} disabled={item.disabled}>
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
