"use client";

import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Store, X } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { showAuthError, showAuthSuccess } from "@/lib/auth-toast";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/", label: "All Products" },
  { href: "/#categories", label: "Categories" },
  { href: "/", label: "My Orders" },
];

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-semibold text-[var(--c-espresso)] transition-colors hover:bg-[var(--c-caramel)]/10 hover:text-[var(--c-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)] focus-visible:ring-offset-2";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const user = session?.user;
  const navigationLinks =
    user?.role === "admin"
      ? [{ href: "/dashboard", label: "Dashboard" }, ...LINKS]
      : LINKS;

  useEffect(() => {
    if (pathname !== "/" || isPending) return;

    const authFlow = new URLSearchParams(window.location.search).get("auth");
    if (!authFlow) return;

    window.history.replaceState(null, "", "/");
    if (!user) return;

    if (authFlow === "google-login") {
      showAuthSuccess(`Welcome back, ${user.name || "friend"}!`);
    } else if (authFlow === "google-register") {
      showAuthSuccess(
        `Your account is ready, ${user.name || "friend"}! Welcome to School Canteen.`,
      );
    }
  }, [isPending, pathname, user]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const result = await signOut();
      if (result?.error) {
        showAuthError(result.error.message || "Unable to sign out. Please try again.");
        return;
      }

      showAuthSuccess("You’re signed out. See you next break!");
      setMenuOpen(false);
      router.replace("/");
      router.refresh();
    } catch {
      showAuthError("Unable to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--c-espresso)]/10 bg-[var(--c-cream)] shadow-sm">
      <nav
        aria-label="Main navigation"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex min-h-[76px] items-center justify-between gap-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)] focus-visible:ring-offset-2"
            aria-label="School Canteen home"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#176B55] text-white shadow-sm">
              <Store size={22} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-extrabold leading-tight tracking-tight text-[var(--c-espresso)] sm:text-lg">
                School Canteen
              </span>
              <span className="mt-1 block text-xs font-medium text-[var(--c-teal)]/75 sm:text-sm">
                Fresh snacks, happy breaks!
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <ul className="hidden items-center gap-1 lg:flex">
              {navigationLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className={linkClass}
                    aria-current={
                      (href === "/" && pathname === "/") ||
                      (href === "/dashboard" && pathname.startsWith("/dashboard"))
                        ? "page"
                        : undefined
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {user ? (
              <div className="hidden items-center gap-2 lg:flex">
                <div
                  className="flex min-w-0 items-center gap-2 rounded-xl border border-[var(--c-caramel)]/25 bg-white/70 py-1.5 pl-1.5 pr-3 shadow-sm"
                  title={user.name || user.email}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--c-teal)] text-sm font-extrabold uppercase text-[var(--c-paper)]">
                    {(user.name || user.email || "U").charAt(0)}
                  </span>
                  <span className="max-w-16 truncate text-xs font-bold text-[var(--c-espresso)] sm:max-w-28 sm:text-sm">
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  aria-label="Log out"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--c-teal)] px-3 text-sm font-bold text-[var(--c-paper)] shadow-sm transition-colors hover:bg-[var(--c-espresso)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)] focus-visible:ring-offset-2 sm:px-4"
                >
                  <LogOut size={16} aria-hidden="true" />
                  <span className="hidden sm:inline">
                    {loggingOut ? "Signing out..." : "Log out"}
                  </span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[var(--c-teal)] px-5 text-sm font-bold text-[var(--c-paper)] shadow-sm transition-colors hover:bg-[var(--c-espresso)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)] focus-visible:ring-offset-2"
              >
                Login
              </Link>
            )}

            <button
              type="button"
              className="grid size-10 place-items-center rounded-xl text-[var(--c-espresso)] transition-colors hover:bg-[var(--c-caramel)]/10 hover:text-[var(--c-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)] focus-visible:ring-offset-2 lg:hidden"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X size={22} aria-hidden="true" />
              ) : (
                <Menu size={22} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <ul
            id="mobile-navigation"
            className="grid gap-1 border-t border-[var(--c-espresso)]/10 py-3 lg:hidden"
          >
            {user && (
              <>
                <li className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--c-teal)] text-sm font-extrabold uppercase text-[var(--c-paper)]">
                    {(user.name || user.email || "U").charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-[var(--c-teal)]">
                      Signed in as
                    </span>
                    <span
                      className="block truncate text-sm font-bold text-[var(--c-espresso)]"
                      title={user.name || user.email}
                    >
                      {user.name || user.email}
                    </span>
                  </span>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className={`flex w-full items-center gap-2 ${linkClass} text-left disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <LogOut size={16} aria-hidden="true" />
                    {loggingOut ? "Signing out..." : "Log out"}
                  </button>
                </li>
              </>
            )}
            {navigationLinks.map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className={`block ${linkClass}`}
                  aria-current={
                    (href === "/" && pathname === "/") ||
                    (href === "/dashboard" && pathname.startsWith("/dashboard"))
                      ? "page"
                      : undefined
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
