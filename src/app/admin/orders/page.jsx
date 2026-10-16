"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import toast from "react-hot-toast";
import { getOrders, updateOrder } from "@/lib/admin-api";
import { EmptyState, ErrorState, LoadingState, PageIntro, Panel, formatDate, formatPrice } from "@/components/admin/AdminUi";

const ORDER_STATUSES = ["Pending", "Confirmed", "Preparing", "Ready", "Completed", "Cancelled"];

function getCustomerName(order) {
  return order.customerName || order.customer?.name || order.customer?.fullName || "Customer";
}

function orderId(order) {
  return order._id || order.id;
}

function StatusBadge({ status }) {
  const normalized = String(status || "Pending");
  const styles = {
    Pending: "bg-amber-50 text-amber-800",
    Confirmed: "bg-blue-50 text-blue-800",
    Preparing: "bg-violet-50 text-violet-800",
    Ready: "bg-emerald-50 text-emerald-800",
    Completed: "bg-[#e9efed] text-[var(--c-teal)]",
    Cancelled: "bg-red-50 text-red-800",
  }[normalized] || "bg-gray-100 text-gray-700";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles}`}>{normalized}</span>;
}

export default function OrdersPage() {
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getOrders({ status: status || undefined, signal: controller.signal })
      .then((items) => {
        setOrders(items);
        setError("");
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [status, reload]);

  async function changeStatus(order, nextStatus) {
    const id = orderId(order);
    if (!id) {
      toast.error("This order is missing its database ID.");
      return;
    }
    try {
      await updateOrder(id, { status: nextStatus });
      toast.success(`Order status changed to ${nextStatus}.`);
      setLoading(true);
      setReload((value) => value + 1);
    } catch (requestError) {
      toast.error(requestError instanceof Error ? requestError.message : "Could not update order.");
    }
  }

  return (
    <>
      <PageIntro eyebrow="Fulfilment" title="Orders" description="Review incoming orders and keep customers informed as you prepare them." />
      <Panel title="Order list" description="Order data is loaded from the connected backend." action={
        <select aria-label="Filter orders by status" value={status} onChange={(event) => { setLoading(true); setStatus(event.target.value); }} className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none focus:border-[var(--c-caramel)]">
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((item) => <option key={item} value={item.toLowerCase()}>{item}</option>)}
        </select>
      }>
        {loading ? <LoadingState label="Loading orders..." /> : error ? <ErrorState message={error} onRetry={() => { setLoading(true); setReload((value) => value + 1); }} /> : !orders.length ? (
          <EmptyState title="No orders found" description={status ? "There are no orders with this status." : "New customer orders will appear here when the orders API is connected."} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-black/5">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-[#f8f5f0] text-xs uppercase tracking-wide text-[#746d64]">
                <tr><th className="px-4 py-3 font-bold">Order</th><th className="px-4 py-3 font-bold">Customer</th><th className="px-4 py-3 font-bold">Items</th><th className="px-4 py-3 font-bold">Total</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 font-bold">Date</th><th className="px-4 py-3 font-bold">Update status</th></tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {orders.map((order, index) => {
                  const id = orderId(order);
                  const items = Array.isArray(order.items) ? order.items : [];
                  const statusLabel = ORDER_STATUSES.find((item) => item.toLowerCase() === String(order.status || "").toLowerCase()) || order.status || "Pending";
                  return (
                    <tr key={id || index} className="hover:bg-[#fcfaf7]">
                      <td className="whitespace-nowrap px-4 py-4 font-bold">#{String(id || "—").slice(-8)}</td>
                      <td className="px-4 py-4">{getCustomerName(order)}</td>
                      <td className="max-w-48 px-4 py-4 text-[#625b52]">{items.length ? items.map((item) => `${item.name || item.productName || "Item"} × ${item.quantity || 1}`).join(", ") : "—"}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold">{formatPrice(order.totalPrice ?? order.total)}</td>
                      <td className="px-4 py-4"><StatusBadge status={statusLabel} /></td>
                      <td className="whitespace-nowrap px-4 py-4 text-[#746d64]">{formatDate(order.createdAt || order.orderDate || order.date)}</td>
                      <td className="px-4 py-4">
                        <select aria-label={`Update status for order ${id}`} value={String(statusLabel)} onChange={(event) => changeStatus(order, event.target.value)} className="h-9 rounded-lg border border-black/10 bg-white px-2 text-xs font-semibold outline-none focus:border-[var(--c-caramel)]">
                          {ORDER_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-[#746d64]"><ClipboardList size={15} />Order status updates use PATCH /api/orders/:id.</p>
    </>
  );
}
