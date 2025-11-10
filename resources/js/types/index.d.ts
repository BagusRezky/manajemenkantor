// types/index.d.ts

import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { Karyawan } from './karyawan';

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    disabled?: boolean;
    permission?: string | null; // <-- DITAMBAHKAN: Untuk hak akses
}

// Tipe ini akan kita gunakan di nav-dropdown.tsx
export interface NavItemWithChildren extends NavItem {
    children?: NavItem[];
}
export type NavItemType = NavItem | NavItemWithChildren;

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[]; // <-- DITAMBAHKAN: Untuk menampung role user
    permissions?: Permission[]; // <-- DITAMBAHKAN: Untuk menampung permission user
    karyawan?: Karyawan;
    [key: string]: unknown;
}

export interface Auth {
    user: User;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}
