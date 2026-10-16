"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Menu,
  PackagePlus,
  Settings2,
  Store,
  Tags,
  UserRound,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/products/new", label: "Add product", icon: PackagePlus },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/settings", label: "Canteen settings", icon: Settings2 },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
];

const PAGE_TITLES = [
  ["/admin/products/new", "Add product"],
  ["/admin/products/", "Edit product"],
  ["/admin/products", "Products"],
  ["/admin/categories", "Categories"],
  ["/admin/orders", "Orders"],
  ["/admin/settings", "Canteen settings"],
  ["/admin/profile", "Profile"],
  ["/admin", "Dashboard"],
];

function SidebarContent({ pathname, onNavigate }) {
  return (
    <>
      <Link
        href="/admin"
        onClick={onNavigate}
        className="mb-8 flex items-center gap-3 px-2"
      >
        <span className="grid size-11 place-items-center rounded-2xl bg-[var(--c-caramel)] text-[var(--c-paper)]">
          <Store size={22} />
        </span>
        <span>
          <span className="block font-extrabold tracking-tight">Canteen</span>
          <span className="block text-xs text-[var(--c-paper)]/55">Admin workspace</span>
        </span>
      </Link>
      <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--c-paper)]/45">
        Workspace
      </p>
      <nav aria-label="Admin navigation" className="space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === href
              : href === "/admin/products"
                ? pathname === href || (pathname.startsWith(`${href}/`) && pathname !== "/admin/products/new")
                : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[var(--c-caramel)] text-white shadow-sm"
                  : "text-[var(--c-paper)]/75 hover:bg-white/10 hover:text-[var(--c-paper)]"
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-white/10 pt-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--c-paper)]/65 transition-colors hover:bg-white/10 hover:text-[var(--c-paper)]"
        >
          <Store size={18} strokeWidth={1.8} />
          Back to storefront
        </Link>
      </div>
    </>
  );
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const title =
    PAGE_TITLES.find(([route]) =>
      route === "/admin" ? pathname === route : pathname.startsWith(route),
    )?.[1] || "Admin";

  return (
    <div className="min-h-screen bg-[#f4f1eb] text-[var(--c-espresso)] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col bg-[var(--c-teal)] px-4 py-6 text-[var(--c-paper)] lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/45"
          />
          <aside className="relative flex h-full w-[min(84vw,300px)] flex-col bg-[var(--c-teal)] px-4 py-6 text-[var(--c-paper)] shadow-2xl">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-4 top-5 rounded-lg p-2 hover:bg-white/10"
            >
              <X size={20} />
            </button>
            <SidebarContent
              pathname={pathname}
              onNavigate={() => setDrawerOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-black/5 bg-white/90 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="rounded-xl p-2 hover:bg-black/5 lg:hidden"
            >
              <Menu size={21} />
            </button>
            <div>
              <p className="text-xs font-medium text-[#746d64]">School Canteen</p>
              <h1 className="text-base font-extrabold leading-tight sm:text-lg">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-3 text-sm font-bold transition hover:border-[var(--c-caramel)] hover:bg-[#fcfaf7]"
            >
              <ArrowUpRight size={16} className="text-[var(--c-caramel)]" />
              <span className="hidden sm:inline">View storefront</span>
              <span className="sm:hidden">Store</span>
            </Link>
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-bold">Canteen Admin</span>
              <span className="block text-xs text-[#746d64]">Management</span>
            </span>
            <span className="grid size-10 place-items-center rounded-full bg-[#ead9c2] text-[var(--c-espresso)]">
              <UserRound size={18} />
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-7 lg:p-9">
          {children}
        </main>
      </div>
    </div>
  );
}
