import Link from "next/link";
import { ShieldCheck, UserRound } from "lucide-react";
import { PageIntro, Panel } from "@/components/admin/AdminUi";

export default function AdminProfilePage() {
  return (
    <>
      <PageIntro eyebrow="Account" title="Admin profile" description="Account management is kept separate from canteen catalogue settings." />
      <Panel className="max-w-2xl">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f0e7db] text-[var(--c-caramel)]"><UserRound size={22} /></span>
          <div>
            <h2 className="font-extrabold">Admin identity is not connected</h2>
            <p className="mt-2 text-sm leading-6 text-[#746d64]">This frontend does not include an authentication provider or admin session API yet. Connect your authentication service before exposing admin data or enabling account editing.</p>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#f8f5f0] p-3 text-xs leading-5 text-[#625b52]"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-[var(--c-teal)]" />Protect all admin API routes on the backend; hiding dashboard links is not access control.</div>
            <Link href="/" className="mt-5 inline-flex text-sm font-bold text-[var(--c-caramel)] hover:underline">Return to storefront</Link>
          </div>
        </div>
      </Panel>
    </>
  );
}
