import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles, Store } from "lucide-react";
import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Create an account | School Canteen",
  description: "Create your School Canteen account.",
};

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-14">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--c-espresso)]/10 bg-white shadow-2xl shadow-[var(--c-espresso)]/10 lg:min-h-[650px] lg:grid-cols-[1fr_0.92fr]">
        <section className="relative order-1 isolate flex min-h-[280px] flex-col justify-between overflow-hidden bg-[var(--c-teal)] p-7 text-[var(--c-paper)] sm:min-h-[320px] sm:p-10 lg:order-1 lg:min-h-full lg:p-12">
          <Image
            src="/school-canteen_items.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="absolute inset-0 -z-20 object-cover opacity-25 mix-blend-luminosity"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--c-teal)]/95 via-[var(--c-teal)]/85 to-[var(--c-espresso)]/90"
          />
          <div
            aria-hidden="true"
            className="absolute -right-20 top-20 -z-10 size-64 rounded-full border-[32px] border-[var(--c-caramel)]/20"
          />

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--c-teal)]"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-[var(--c-caramel)] text-[var(--c-paper)] shadow-lg">
              <Store size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-extrabold leading-tight">
                School Canteen
              </span>
              <span className="mt-1 block text-xs font-medium text-[var(--c-paper)]/70">
                Fresh snacks, happy breaks!
              </span>
            </span>
          </Link>

          <div className="relative mt-12 max-w-md lg:mt-0">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--c-paper)]/15 bg-[var(--c-paper)]/10 px-3.5 py-2 text-xs font-bold tracking-wide text-[var(--c-paper)]/90">
              <Sparkles
                size={15}
                className="text-[var(--c-caramel)]"
                aria-hidden="true"
              />
              YOUR BREAK, YOUR FAVOURITES
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              Make every
              <span className="block text-[var(--c-caramel)]">
                break a good one.
              </span>
            </h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-[var(--c-paper)]/75">
              Create your account to order canteen favourites ahead and make
              more of every school break.
            </p>
          </div>

          <div className="relative mt-10 inline-flex items-center gap-2 text-sm font-medium text-[var(--c-paper)]/75 lg:mt-0">
            <ShieldCheck
              size={17}
              className="text-[var(--c-caramel)]"
              aria-hidden="true"
            />
            A simple account for your school community
          </div>
        </section>

        <section className="order-2 flex items-center justify-center px-6 py-8 sm:px-12 sm:py-12 lg:order-2">
          <div className="w-full max-w-sm">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-[var(--c-teal)] transition-colors hover:text-[var(--c-caramel)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)] focus-visible:ring-offset-4"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to home
            </Link>

            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--c-caramel)]">
              Join the canteen
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--c-espresso)] sm:text-4xl">
              Create your account
            </h2>
            <p className="mt-3 text-base leading-7 text-[var(--c-teal)]/75">
              Sign up with your details or continue with Google.
            </p>

            <RegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}
