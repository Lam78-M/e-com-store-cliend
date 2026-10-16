import Link from "next/link";
import { Banknote, Clock, MapPin, Phone, UtensilsCrossed } from "lucide-react";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/offers", label: "Offers" },
  { href: "/orders", label: "My Orders" },
  { href: "/cart", label: "Cart" },
];

const CATEGORIES = [
  { href: "/menu?category=chips", label: "Chips" },
  { href: "/menu?category=biscuit", label: "Biscuit" },
  { href: "/menu?category=chocolate", label: "Chocolate" },
  { href: "/menu?category=ice-cream", label: "Ice Cream" },
  { href: "/menu?category=drinks", label: "Drinks" },
];

const INFO = [
  {
    icon: Clock,
    lines: ["1st break: 10:30 AM", "2nd break: 12:30 PM", "Sun - Thu (school din)"],
  },
  { icon: Banknote, lines: ["Payment: pickup er shomoy cash"] },
  { icon: MapPin, lines: ["Ground floor, main building"] },
  { icon: Phone, lines: ["01XXX-XXXXXX"] },
];

const linkClass =
  "inline-block py-1 opacity-80 transition-opacity hover:underline hover:opacity-100 focus-visible:underline focus-visible:opacity-100";

export default function Footer() {
  return (
    <footer className=" border-t-4 border-[var(--c-caramel)] bg-[var(--c-teal)] text-[var(--c-paper)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-4 lg:gap-x-10">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--c-caramel)] text-[var(--c-paper)]">
              <UtensilsCrossed size={20} />
            </span>
            <span className="text-lg font-extrabold">School Canteen</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-80">
            Break time e line e dariye thakte hobe na. Age order koro, canteen
            theke tomar khabar nao.
          </p>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links" className="col-span-1">
          <h3 className="mb-3 font-bold">Quick links</h3>
          <ul className="text-sm">
            {QUICK_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Categories */}
        <nav aria-label="Categories" className="col-span-1">
          <h3 className="mb-3 font-bold">Categories</h3>
          <ul className="text-sm">
            {CATEGORIES.map(({ href, label }) => (
              <li key={label}>
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Canteen info */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="mb-3 font-bold">Canteen info</h3>
          <ul className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-1">
            {INFO.map(({ icon: Icon, lines }, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--c-caramel)] text-[var(--c-paper)]">
                  <Icon size={16} />
                </span>
                <span className="pt-1 leading-snug">
                  {lines.map((line, j) => (
                    <span
                      key={j}
                      className={`block ${j > 0 ? "opacity-70" : ""}`}
                    >
                      {line}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-center text-xs opacity-70 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left">
          <p>© {new Date().getFullYear()} School Canteen. All rights reserved.</p>
          <p>Allergy thakle canteen staff ke age janiye nio.</p>
        </div>
      </div>
    </footer>
  );
}   ``