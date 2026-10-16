import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 overflow-hidden rounded-[2rem] bg-[var(--c-teal)] px-6 py-10 text-[var(--c-paper)] shadow-xl shadow-[var(--c-espresso)]/10 sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-14 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border-[36px] border-[var(--c-caramel)]/15"
        />
        <div className="relative z-10">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--c-paper)]/15 bg-[var(--c-paper)]/5 px-3.5 py-2 text-xs font-bold tracking-wide text-[var(--c-paper)]/90">
            <Sparkles size={15} className="text-[var(--c-caramel)]" aria-hidden="true" />
            SCHOOL CANTEEN, MADE SIMPLE
          </span>

          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Your break time,
            <span className="block text-[var(--c-caramel)]">made tastier.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-[var(--c-paper)]/75 sm:text-lg">
            Pick your favourites, order ahead, and spend less time in line.
            Good food is just a few taps away.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/menu"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--c-caramel)] px-5 py-3 font-bold text-[var(--c-paper)] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--c-paper)]"
            >
              Explore the menu
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/offers"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--c-paper)]/20 px-5 py-3 font-semibold text-[var(--c-paper)] transition hover:bg-[var(--c-paper)]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--c-paper)]"
            >
              See today’s offers
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--c-paper)]/70">
            <span className="inline-flex items-center gap-2">
              <Check size={16} className="text-[var(--c-caramel)]" aria-hidden="true" />
              Easy ordering
            </span>
            <span className="inline-flex items-center gap-2">
              <Check size={16} className="text-[var(--c-caramel)]" aria-hidden="true" />
              Pickup at the canteen
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:ml-auto">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rotate-3 rounded-[2rem] bg-[var(--c-caramel)]/20"
          />
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[var(--c-cream)] p-2 shadow-2xl shadow-black/20 sm:p-3">
            <img
              src="/School_canteen_banner.png"
              alt="School canteen banner"
              className="h-[420px] w-full rounded-[1.2rem] object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
