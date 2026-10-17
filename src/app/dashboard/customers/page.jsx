"use client";

import { useMemo, useState } from "react";
import { DashboardPageHeader, DashboardSearch, dashboardPanelClass } from "../_components/DashboardContent";
import { customers } from "../_components/dashboard-data";

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) =>
        `${customer.name} ${customer.email}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Community"
        title="Customers"
        description="View customer accounts and their canteen order activity."
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium text-[#849088]">{filteredCustomers.length} customers</p>
        <DashboardSearch value={query} onChange={setQuery} label="Search customers" />
      </div>
      <div className={`${dashboardPanelClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead>
              <tr className="border-b border-[#f0f0eb] text-[10px] font-bold uppercase tracking-[0.12em] text-[#9aa19c]">
                <th className="px-6 py-4">Customer</th>
                <th className="px-4 py-4">Orders</th>
                <th className="px-4 py-4">Total spent</th>
                <th className="px-4 py-4">Account</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.email} className="border-b border-[#f3f3ef] last:border-0">
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-[#edf1eb] text-[10px] font-bold text-[#587060]">{customer.initials}</span>
                      <span>
                        <span className="block text-xs font-bold text-[#35413b]">{customer.name}</span>
                        <span className="mt-1 block text-[10px] text-[#9ba29d]">{customer.email}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-[#65736a]">{customer.orders}</td>
                  <td className="px-4 py-4 text-xs font-bold">{customer.spent}</td>
                  <td className="px-4 py-4"><span className="rounded-full bg-[#e7f2e9] px-2.5 py-1 text-[10px] font-bold text-[#497456]">Active</span></td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-sm text-[#8b958f]">No customers match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
