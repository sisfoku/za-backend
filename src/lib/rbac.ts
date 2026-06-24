import type { Role, ViewKey } from "./types";

export const ROLES: { value: Role; label: string; description: string }[] = [
  { value: "superadmin", label: "Superadmin", description: "Akses penuh seluruh sistem & pengaturan" },
  { value: "admin", label: "Admin", description: "Manajemen operasional & pengguna" },
  { value: "operator", label: "Operator", description: "Chatbot, kontak, dan order harian" },
  { value: "manager", label: "Manager", description: "Pantau laporan & performa tim" },
  { value: "marketing", label: "Marketing", description: "Kampanye, broadcast, dan konten" },
  { value: "keuangan", label: "Keuangan", description: "Faktur, pembayaran, dan pendapatan" },
];

export const ROLE_LABELS: Record<Role, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  operator: "Operator",
  manager: "Manager",
  marketing: "Marketing",
  keuangan: "Keuangan",
};

export interface MenuItem {
  key: ViewKey;
  label: string;
  icon: string; // lucide icon name
  roles: Role[];
  badge?: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    key: "overview",
    label: "Dashboard",
    icon: "LayoutDashboard",
    roles: ["superadmin", "admin", "operator", "manager", "marketing", "keuangan"],
  },
  {
    key: "chatbot",
    label: "Chatbot WhatsApp",
    icon: "MessageCircle",
    roles: ["superadmin", "admin", "operator", "marketing"],
  },
  {
    key: "contacts",
    label: "Kontak & Leads",
    icon: "Users",
    roles: ["superadmin", "admin", "operator", "manager", "marketing"],
  },
  {
    key: "properties",
    label: "Properti",
    icon: "Building2",
    roles: ["superadmin", "admin", "operator", "manager", "marketing"],
  },
  {
    key: "orders",
    label: "Order",
    icon: "ShoppingBag",
    roles: ["superadmin", "admin", "operator", "manager", "keuangan"],
  },
  {
    key: "marketing",
    label: "Marketing",
    icon: "Megaphone",
    roles: ["superadmin", "admin", "manager", "marketing"],
  },
  {
    key: "finance",
    label: "Keuangan",
    icon: "Wallet",
    roles: ["superadmin", "admin", "manager", "keuangan"],
  },
  {
    key: "users",
    label: "Manajemen Pengguna",
    icon: "ShieldCheck",
    roles: ["superadmin", "admin"],
  },
  {
    key: "settings",
    label: "Pengaturan",
    icon: "Settings",
    roles: ["superadmin", "admin", "operator", "manager", "marketing", "keuangan"],
  },
];

export function menuForRole(role: Role): MenuItem[] {
  return MENU_ITEMS.filter((m) => m.roles.includes(role));
}

export function canAccess(role: Role, view: ViewKey): boolean {
  const item = MENU_ITEMS.find((m) => m.key === view);
  return item ? item.roles.includes(role) : false;
}

export function defaultViewForRole(role: Role): ViewKey {
  return "overview";
}

export const ROLE_THEME: Record<Role, { color: string; bg: string; ring: string }> = {
  superadmin: { color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/40", ring: "ring-rose-200 dark:ring-rose-900" },
  admin: { color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", ring: "ring-emerald-200 dark:ring-emerald-900" },
  operator: { color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40", ring: "ring-amber-200 dark:ring-amber-900" },
  manager: { color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40", ring: "ring-violet-200 dark:ring-violet-900" },
  marketing: { color: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-950/40", ring: "ring-pink-200 dark:ring-pink-900" },
  keuangan: { color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950/40", ring: "ring-teal-200 dark:ring-teal-900" },
};
