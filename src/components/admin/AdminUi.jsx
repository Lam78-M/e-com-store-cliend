import Link from "next/link";
import { ArrowRight, PackageOpen } from "lucide-react";

export function PageIntro({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[var(--c-caramel)]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#746d64]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({ children, disabled, type = "button", ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--c-teal)] px-4 py-2.5 text-sm font-bold text-[var(--c-paper)] shadow-sm transition hover:bg-[#243333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-caramel)] disabled:cursor-not-allowed disabled:opacity-55"
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryLink({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-[var(--c-espresso)] transition hover:border-[var(--c-caramel)] hover:bg-[#fcfaf7]"
    >
      {children}
    </Link>
  );
}

export function Panel({ title, description, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-black/5 bg-white p-5 shadow-[0_3px_16px_rgba(58,26,20,0.04)] sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            {title && <h3 className="font-extrabold">{title}</h3>}
            {description && <p className="mt-1 text-sm text-[#746d64]">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function LoadingState({ label = "Loading..." }) {
  return (
    <div role="status" className="flex min-h-44 items-center justify-center gap-3 rounded-2xl border border-black/5 bg-white p-8 text-sm font-medium text-[#746d64]">
      <span className="size-5 animate-spin rounded-full border-2 border-[var(--c-caramel)]/25 border-t-[var(--c-caramel)] motion-reduce:animate-none" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
      <p className="font-bold">Could not load this information</p>
      <p className="mt-1 leading-6">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-3 font-bold underline underline-offset-2">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-[#fcfaf7] px-5 py-10 text-center">
      <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-[#f0e7db] text-[var(--c-caramel)]">
        <PackageOpen size={23} />
      </span>
      <h3 className="font-extrabold">{title}</h3>
      <p className="mt-1 max-w-md text-sm leading-6 text-[#746d64]">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, note, icon: Icon, accent = false }) {
  return (
    <article className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_3px_16px_rgba(58,26,20,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#746d64]">{label}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight">{value}</p>
        </div>
        <span className={`grid size-11 place-items-center rounded-xl ${accent ? "bg-[#f2e2cb] text-[var(--c-caramel)]" : "bg-[#e9efed] text-[var(--c-teal)]"}`}>
          <Icon size={20} />
        </span>
      </div>
      {note && <p className="mt-3 text-xs text-[#81796f]">{note}</p>}
    </article>
  );
}

export function ActionLink({ href, children }) {
  return (
    <Link href={href} className="group flex items-center justify-between gap-3 rounded-xl border border-black/5 bg-white p-4 text-sm font-bold transition hover:-translate-y-0.5 hover:border-[var(--c-caramel)]/40 hover:shadow-md">
      {children}
      <ArrowRight size={17} className="text-[var(--c-caramel)] transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(number);
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function AvailabilityBadge({ available }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${available ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
      <span className={`size-1.5 rounded-full ${available ? "bg-emerald-600" : "bg-amber-600"}`} />
      {available ? "Available" : "Out of stock"}
    </span>
  );
}
