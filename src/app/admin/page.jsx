"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  Clock3,
  Package,
  PackageX,
  Plus,
  Tags,
  Utensils,
} from "lucide-react";
import { getOrders, getProducts, CATEGORIES } from "@/lib/admin-api";
import ProductTable from "@/components/admin/ProductTable";
import {
  ActionLink,
  ErrorState,
  LoadingState,
  PageIntro,
  Panel,
  PrimaryButton,
  StatCard,
  formatPrice,
} from "@/components/admin/AdminUi";

function isToday(value) {
  if (!value) return false;
  const date = new Date(value);
  const today = new Date();
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productError, setProductError] = useState("");
  const [orderError, setOrderError] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getProducts({ signal: controller.signal })
      .then((items) => {
        setProducts(items);
        setProductError("");
      })
      .catch((error) => {
        if (!controller.signal.aborted) setProductError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingProducts(false);
      });
    getOrders({ signal: controller.signal })
      .then((items) => {
        setOrders(items);
        setOrderError("");
      })
      .catch((error) => {
        if (!controller.signal.aborted) setOrderError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingOrders(false);
      });
    return () => controller.abort();
  }, [reload]);

  const availableCount = products.filter((product) => product.available).length;
  const todayOrders = orders.filter((order) =>
    isToday(order.createdAt || order.orderDate || order.date),
  );
  const todaySales = todayOrders
    .filter((order) => order.status !== "Cancelled" && order.status !== "cancelled")
    .reduce(
      (sum, order) => sum + Number(order.totalPrice ?? order.total ?? 0),
      0,
    );
  const stats = [
    { label: "Total products", value: loadingProducts ? "—" : productError ? "—" : products.length, note: "In the catalogue", icon: Package },
    { label: "Available products", value: loadingProducts ? "—" : productError ? "—" : availableCount, note: "Ready to order", icon: Boxes },
    { label: "Out of stock", value: loadingProducts ? "—" : productError ? "—" : products.length - availableCount, note: "Currently unavailable", icon: PackageX, accent: true },
    { label: "Categories", value: CATEGORIES.length, note: "Configured product groups", icon: Tags },
    { label: "Today's orders", value: loadingOrders ? "—" : orderError ? "—" : todayOrders.length, note: "Orders placed today", icon: Utensils },
    { label: "Today's sales", value: loadingOrders ? "—" : orderError ? "—" : formatPrice(todaySales), note: "Excludes cancelled orders", icon: CircleDollarSign, accent: true },
  ];

  return (
    <>
      <PageIntro
        eyebrow="Overview"
        title="Good day, Admin"
        description="A clear view of your canteen catalogue and today's activity."
        action={<Link href="/admin/products/new"><PrimaryButton><Plus size={17} />Add product</PrimaryButton></Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>
      {(productError || orderError) && (
        <div className="mt-5 space-y-3">
          {productError && <ErrorState message={`Products: ${productError}`} onRetry={() => { setLoadingProducts(true); setReload((value) => value + 1); }} />}
          {orderError && <ErrorState message={`Orders and sales: ${orderError}`} onRetry={() => { setLoadingOrders(true); setReload((value) => value + 1); }} />}
        </div>
      )}

      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)]">
        <Panel title="Recent products" description="Latest items added to your catalogue." action={
          <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm font-bold text-[var(--c-caramel)] hover:underline">
            All products <ArrowUpRight size={16} />
          </Link>
        }>
          {loadingProducts ? (
            <LoadingState label="Loading products..." />
          ) : productError ? (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">Products could not be loaded. Resolve the API error above to view recent items.</p>
          ) : (
            <ProductTable
              products={[...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5)}
              onChanged={() => setReload((value) => value + 1)}
              emptyDescription="No products have been added yet."
            />
          )}
        </Panel>
        <Panel title="Quick actions" description="Common tasks, just a click away.">
          <div className="space-y-2.5">
            <ActionLink href="/admin/products/new">Add new product</ActionLink>
            <ActionLink href="/admin/products">Manage products</ActionLink>
            <ActionLink href="/admin/categories">Manage categories</ActionLink>
            <ActionLink href="/admin/orders">View orders</ActionLink>
          </div>
          <div className="mt-5 rounded-xl bg-[#f8f5f0] p-4">
            <div className="flex items-center gap-2 text-sm font-bold"><Clock3 size={17} className="text-[var(--c-caramel)]" />Canteen hours</div>
            <p className="mt-2 text-xs leading-5 text-[#746d64]">Update school and canteen hours in settings. Hours shown here are loaded from your settings API.</p>
            <Link href="/admin/settings" className="mt-3 inline-block text-xs font-bold text-[var(--c-caramel)] hover:underline">Open settings</Link>
          </div>
        </Panel>
      </div>
    </>
  );
}
