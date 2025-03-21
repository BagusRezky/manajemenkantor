import { usePage, Link } from '@inertiajs/react';
import { ChevronDown, ChevronRight,  LucideIcon } from 'lucide-react';
import { useState } from 'react';
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



export function DropdownMenuItem({ item }: { item: NavItemWithChildren }) {
    const [isOpen, setIsOpen] = useState(false);
    const page = usePage();

    // Check if any child is active
    const isChildActive = item.children?.some((child) => child.href === page.url);

    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton onClick={() => setIsOpen(!isOpen)} isActive={isChildActive}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {isOpen ? <ChevronDown className="ml-auto h-4 w-4" /> : <ChevronRight className="ml-auto h-4 w-4" />}
            </SidebarMenuButton>

            {isOpen && item.children && (
                <SidebarMenuSub>
                    {item.children.map((child) => (
                        <SidebarMenuSubItem key={child.title}>
                            <SidebarMenuSubButton asChild isActive={child.href === page.url}>
                                <Link href={child.href || '#'}>
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
export function NavDropdown({  items = [] }: {  items: NavItemType[] }) {
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
                                <Link href={item.href || '#'}>
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
