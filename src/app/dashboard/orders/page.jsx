"use client";

import { useMemo, useState } from "react";
import { DashboardPageHeader, DashboardSearch, DashboardStatusBadge, dashboardPanelClass } from "../_components/DashboardContent";
import { orders } from "../_components/dashboard-data";

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All orders");
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesQuery = `${order.id} ${order.customer}`.toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (statusFilter === "All orders" || order.status === statusFilter);
      }),
    [query, statusFilter],
  );

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Order management"
        title="Orders"
        description="Review incoming orders and track preparation status."
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <select
          aria-label="Filter orders by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-10 rounded-xl border border-[#e4e6e0] bg-white px-3 text-sm text-[#69756e] outline-none focus:border-[#789582]"
        >
          {["All orders", "Ready", "Preparing", "Complete"].map((status) => <option key={status}>{status}</option>)}
        </select>
        <DashboardSearch value={query} onChange={setQuery} label="Search orders" />
      </div>
      <div className={`${dashboardPanelClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-[#f0f0eb] text-[10px] font-bold uppercase tracking-[0.12em] text-[#9aa19c]">
                <th className="px-6 py-4">Order</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Total</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#f3f3ef] last:border-0">
                  <td className="px-6 py-4 text-xs font-bold text-[#496355]">{order.id}</td>
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-2.5">
                      <span className="grid size-8 place-items-center rounded-full bg-[#edf1eb] text-[10px] font-bold text-[#587060]">{order.initials}</span>
                      <span>
                        <span className="block text-xs font-bold text-[#3a4540]">{order.customer}</span>
                        <span className="mt-0.5 block text-[10px] text-[#9ba29d]">{order.items} items</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-[#828d86]">{order.date}</td>
                  <td className="px-4 py-4 text-xs font-bold">{order.total}</td>
                  <td className="px-4 py-4"><DashboardStatusBadge status={order.status} /></td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-sm text-[#8b958f]">No orders match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
