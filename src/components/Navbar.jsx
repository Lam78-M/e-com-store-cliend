"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Home,
  LayoutDashboard,
  Menu as MenuIcon,
  Moon,
  Package,
  Search,
  ShoppingCart,
  Sun,
  Tag,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/offers", label: "Offers", icon: Tag },
  { href: "/orders", label: "My Orders", icon: Package },
  { href: "/admin", label: "Admin", icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // TODO: cart store (Zustand/Context) theke ashbe
  const cartCount = 3;
  // TODO: NextAuth session theke ashbe. Login thakle { name: "Rahim" }
  const user = null;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // route change hole drawer bondho
  useEffect(() => setDrawerOpen(false), [pathname]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const handleSearch = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim();
    if (!q) return toast.error("Kichu likhe search koro");
    window.location.href = `/menu?search=${encodeURIComponent(q)}`;
  };

  return (
    <>
      {/* ============ TOP BAR ============ */}
      <header
        className={`sticky top-0 z-50 bg-[var(--c-cream)] text-[var(--c-espresso)] border-b border-[var(--c-espresso)]/10 transition-shadow ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          {/* Logo (pore bodlabe) */}
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--c-caramel)] text-[var(--c-cream)]">
              <UtensilsCrossed size={20} />
            </span>
            <span className="text-lg font-extrabold leading-none">
              School Canteen
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="relative px-3 py-2 text-sm font-semibold"
                >
                  {label}
                  {isActive(href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded bg-[var(--c-caramel)]"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-full p-2 hover:bg-[var(--c-espresso)]/10"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 hover:bg-[var(--c-espresso)]/10"
              aria-label="Toggle theme"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-full p-2 hover:bg-[var(--c-espresso)]/10"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 12 }}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--c-caramel)] px-1 text-[11px] font-bold text-[var(--c-espresso)]"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* Login / Profile (desktop) */}
            {user ? (
              <Link
                href="/profile"
                className="ml-1 hidden items-center gap-2 rounded-full bg-[var(--c-espresso)] px-3 py-1.5 text-sm font-bold text-[var(--c-cream)] md:flex"
              >
                <User size={16} /> {user.name}
              </Link>
            ) : (
              <Link
                href="/login"
                className="ml-1 hidden rounded-full bg-[var(--c-espresso)] px-4 py-1.5 text-sm font-bold text-[var(--c-cream)] md:block"
              >
                Login
              </Link>
            )}

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-full p-2 hover:bg-[var(--c-espresso)]/10 md:hidden"
              aria-label="Open menu"
            >
              <MenuIcon size={22} />
            </button>
          </div>
        </nav>

        {/* Search bar */}
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form
                onSubmit={handleSearch}
                className="mx-auto flex max-w-6xl gap-2 px-4 pb-3"
              >
                <input
                  name="q"
                  autoFocus
                  placeholder="Chips, biscuit, chocolate, ice cream..."
                  className="w-full rounded-full border border-[var(--c-espresso)]/20 bg-white/50 px-4 py-2 text-sm text-[var(--c-espresso)] outline-none placeholder:text-[var(--c-espresso)]/50 focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[var(--c-espresso)] px-4 text-sm font-bold text-[var(--c-cream)]"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============ MOBILE DRAWER ============ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-[var(--c-cream)] p-5 text-[var(--c-espresso)] md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-lg font-extrabold text-[var(--c-espresso)]">
                  School Canteen
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full p-2 hover:bg-[var(--c-espresso)]/10"
                >
                  <X size={22} />
                </button>
              </div>

              <ul className="flex flex-col gap-1">
                {LINKS.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 font-semibold ${
                        isActive(href)
                          ? "bg-[var(--c-espresso)] text-[var(--c-cream)]"
                          : "hover:bg-[var(--c-espresso)]/10"
                      }`}
                    >
                      <Icon size={20} /> {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {user ? (
                  <button
                    onClick={() => toast.success("Logged out")}
                    className="w-full rounded-xl bg-[var(--c-espresso)] py-3 font-bold text-[var(--c-cream)]"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full rounded-xl bg-[var(--c-espresso)] py-3 text-center font-bold text-[var(--c-cream)]"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ============ MOBILE BOTTOM NAV ============ */}
    
    </>
  );
}