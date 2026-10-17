"use client";

import {
  DashboardMetricCard,
  DashboardPageHeader,
} from "./_components/DashboardContent";
import { dashboardStats } from "./_components/dashboard-data";
import SalesChart from "./_components/SalesChart";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Store overview"
        title="Dashboard overview"
        description="A quick look at your canteen's performance."
      />

      <div className="rounded-xl border border-[#eadfc7] bg-[#fbf7ee] px-4 py-3 text-xs leading-5 text-[#81734f]">
        Preview dashboard — figures are sample data until a store backend is
        connected.
      </div>

      <section
        aria-label="Store summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {dashboardStats.map((stat, index) => (
          <DashboardMetricCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <section aria-label="Sales chart">
        <SalesChart />
      </section>
    </div>
  );
}
