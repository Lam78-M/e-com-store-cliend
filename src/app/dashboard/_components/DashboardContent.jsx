"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";

export const dashboardPanelClass =
  "rounded-2xl border border-[#e9e8e2] bg-white shadow-[0_2px_12px_rgba(39,51,45,0.025)]";

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  action,
  actionHref,
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a17c4e]">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#28332f] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-[#7e8982]">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={actionHref}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#263e39] px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1b302a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b38a56] focus-visible:ring-offset-2"
        >
          {action}
        </Link>
      )}
    </div>
  );
}

export function DashboardMetricCard({ stat, index = 0 }) {
  const Icon = stat.icon;
  const tones = {
    green: "bg-[#e8f1e9] text-[#477257]",
    blue: "bg-[#e9f0f6] text-[#527692]",
    amber: "bg-[#f7f0e2] text-[#a17c3e]",
    purple: "bg-[#f0ecf6] text-[#79669a]",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.07 }}
      className={`${dashboardPanelClass} p-5`}
    >
      <div className="flex items-start justify-between">
        <span className={`grid size-10 place-items-center rounded-xl ${tones[stat.tone]}`}>
          <Icon size={19} aria-hidden="true" />
        </span>
        <button
          type="button"
          aria-label={`More ${stat.label} options`}
          className="grid size-8 place-items-center rounded-lg text-[#a0a8a2] hover:bg-[#f6f5f1]"
        >
          <MoreHorizontal size={18} aria-hidden="true" />
        </button>
      </div>
      <p className="mt-4 text-xs font-semibold text-[#828d86]">{stat.label}</p>
      <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <p className="text-2xl font-extrabold tracking-tight text-[#28332f]">
          {stat.value}
        </p>
        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#4c8460]">
          <ArrowUpRight size={13} aria-hidden="true" />
          {stat.change}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-[#a1a8a3]">{stat.note}</p>
    </motion.article>
  );
}

export function DashboardSectionHeading({ eyebrow, title, action, actionHref }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.17em] text-[#929b95]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-extrabold tracking-tight text-[#28332f] sm:text-xl">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          href={actionHref}
          className="shrink-0 text-xs font-bold text-[#46695a] transition hover:text-[#263e39]"
        >
          {action}
        </Link>
      )}
    </div>
  );
}

export function DashboardStatusBadge({ status }) {
  const classes = {
    Ready: "bg-[#e7f2e9] text-[#497456]",
    Preparing: "bg-[#f8f0df] text-[#9a783c]",
    Complete: "bg-[#edf0f2] text-[#6e7c84]",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${classes[status] || "bg-[#edf0f2] text-[#6e7c84]"}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function DashboardSearch({ value, onChange, label = "Search" }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className="h-10 w-full rounded-xl border border-[#e4e6e0] bg-white px-3 text-sm outline-none transition placeholder:text-[#a4aaa5] focus:border-[#789582] focus:ring-4 focus:ring-[#789582]/10 sm:w-64"
      />
    </label>
  );
}
