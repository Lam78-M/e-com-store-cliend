"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChartNoAxesCombined,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Store,
  Tags,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { showAuthError, showAuthSuccess } from "@/lib/auth-toast";

const navigation = [
  { label: "Overview", id: "overview", icon: LayoutDashboard },
  { label: "Products", id: "products", icon: Package },
  { label: "Orders", id: "orders", icon: ShoppingBag, badge: "8" },
  { label: "Upload products", id: "upload", icon: Plus },
  { label: "Customers", id: "customers", icon: UsersRound },
  { label: "Categories", id: "categories", icon: Tags },
];

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#f6f5f1] p-5 sm:p-8" aria-label="Loading dashboard">
      <div className="mx-auto max-w-7xl animate-pulse space-y-7">
        <div className="h-8 w-56 rounded-lg bg-[#e5e4df]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {navigation.slice(0, 4).map(({ label }) => (
            <div key={label} className="h-32 rounded-2xl bg-white" />
          ))}
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
          <div className="h-80 rounded-2xl bg-white" />
          <div className="h-80 rounded-2xl bg-white" />
        </div>
        <div className="h-72 rounded-2xl bg-white" />
      </div>
    </div>
  );
}

function SidebarContents({ onNavigate, pathname }) {
  return (
    <>
      <Link
        href="/"
        className="mb-9 flex items-center gap-3 rounded-xl px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a56]"
        onClick={onNavigate}
      >
        <span className="grid size-11 place-items-center rounded-2xl bg-[#263e39] text-white">
          <Store size={21} aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-extrabold text-[#28332f]">
            School Canteen
          </span>
          <span className="mt-0.5 block text-xs font-medium text-[#88918b]">
            Store admin
          </span>
        </span>
      </Link>

      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.19em] text-[#9aa19b]">
        Workspace
      </p>
      <nav aria-label="Dashboard sections" className="space-y-1">
        {navigation.map(({ label, id, icon: Icon, badge }) => (
          <Link
            key={id}
            href={id === "overview" ? "/dashboard" : `/dashboard/${id}`}
            onClick={onNavigate}
            className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a56] ${
              (id === "overview" && pathname === "/dashboard") ||
              pathname === `/dashboard/${id}`
                ? "bg-[#263e39] text-white shadow-sm"
                : "text-[#68736d] hover:bg-[#f1f2ee] hover:text-[#263e39]"
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="rounded-md bg-[#e8eee9] px-2 py-0.5 text-[10px] font-bold text-[#426253]">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-1 pt-8">
        <Link
          href="/"
          onClick={onNavigate}
          className="mb-3 flex min-h-11 items-center gap-3 rounded-xl border border-[#e3e9e3] bg-[#f5f8f4] px-3 text-sm font-bold text-[#456653] transition-colors hover:border-[#c9d8cc] hover:bg-[#edf3ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a56]"
        >
          <Store size={18} aria-hidden="true" />
          View storefront
        </Link>
        <a
          href="#settings"
          onClick={onNavigate}
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#68736d] transition-colors hover:bg-[#f1f2ee] hover:text-[#263e39]"
        >
          <Settings size={18} aria-hidden="true" />
          Settings
        </a>
        <a
          href="#help"
          onClick={onNavigate}
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#68736d] transition-colors hover:bg-[#f1f2ee] hover:text-[#263e39]"
        >
          <CircleHelp size={18} aria-hidden="true" />
          Help centre
        </a>
        <div className="mt-5 rounded-2xl bg-[#f4f2ec] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#35433c]">
            <ChartNoAxesCombined size={15} aria-hidden="true" />
            Dashboard preview
          </div>
          <p className="text-xs leading-5 text-[#7c8780]">
            Sample figures are shown until store data is connected.
          </p>
        </div>
      </div>
    </>
  );
}

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const user = session?.user;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const result = await signOut();
      if (result?.error) {
        showAuthError(result.error.message || "Unable to sign out. Please try again.");
        return;
      }
      showAuthSuccess("You’re signed out.");
      router.replace("/login");
      router.refresh();
    } catch {
      showAuthError("Unable to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  if (isPending) return <DashboardSkeleton />;

  if (!user || user.role !== "admin") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f5f1] px-5">
        <div className="max-w-md rounded-3xl border border-[#e8e7e1] bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#edf2ee] text-[#315347]">
            <Settings size={24} aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-[#28332f]">
            Admin access required
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#748079]">
            Sign in with an administrator account to open the store dashboard.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#263e39] px-5 text-sm font-bold text-white transition hover:bg-[#182c27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a56] focus-visible:ring-offset-2"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const displayName = user.name || user.email || "Administrator";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#28332f]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-[#e9e8e2] bg-white px-5 py-6 lg:flex">
        <SidebarContents
          pathname={pathname}
        />
      </aside>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-40 bg-[#17231f]/35 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[min(84vw,300px)] flex-col bg-white px-5 py-6 shadow-2xl lg:hidden"
              initial={{ x: -310 }}
              animate={{ x: 0 }}
              exit={{ x: -310 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.17em] text-[#8b958f]">
                  Navigation
                </span>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="grid size-10 place-items-center rounded-xl text-[#53615a] hover:bg-[#f1f2ee]"
                >
                  <X size={19} aria-hidden="true" />
                </button>
              </div>
              <SidebarContents
                pathname={pathname}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between gap-4 border-b border-[#e9e8e2] bg-white/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#e8e8e2] text-[#53615a] hover:bg-[#f6f5f1] lg:hidden"
            >
              <Menu size={19} aria-hidden="true" />
            </button>
            <div className="hidden items-center gap-2 rounded-xl border border-[#e8e8e2] bg-[#fafaf8] px-3 sm:flex sm:w-64">
              <Search size={16} className="text-[#99a19c]" aria-hidden="true" />
              <input
                type="search"
                aria-label="Search dashboard"
                placeholder="Search anything..."
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a4aaa5]"
              />
              <kbd className="rounded border border-[#e7e7e1] bg-white px-1.5 py-0.5 text-[10px] text-[#8b958f]">
                /
              </kbd>
            </div>
            <span className="truncate text-sm font-bold sm:hidden">
              Store dashboard
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden rounded-full bg-[#f4f2ec] px-3 py-1.5 text-[11px] font-bold text-[#837149] md:inline-flex">
              SAMPLE DATA
            </span>
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid size-10 place-items-center rounded-xl text-[#65716b] transition hover:bg-[#f6f5f1]"
            >
              <Bell size={19} aria-hidden="true" />
              <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-[#c57951]" />
            </button>
            <span className="hidden h-8 w-px bg-[#e9e8e2] sm:block" />
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-[#dfe9e1] text-sm font-extrabold text-[#315347]">
                {initial}
              </span>
              <span className="hidden max-w-36 truncate text-sm font-semibold sm:block">
                {displayName}
              </span>
              <ChevronDown
                size={15}
                className="hidden text-[#87918b] sm:block"
                aria-hidden="true"
              />
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Log out"
              title={loggingOut ? "Signing out..." : "Log out"}
              className="grid size-9 place-items-center rounded-xl text-[#748079] transition hover:bg-[#f8eae5] hover:text-[#a84d38] disabled:opacity-50"
            >
              <LogOut size={17} aria-hidden="true" />
            </button>
          </div>
        </header>

        <motion.main
          className="mx-auto max-w-[1500px] space-y-8 p-4 pb-12 sm:p-7 xl:p-9"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}