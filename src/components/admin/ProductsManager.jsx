"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { CATEGORIES, getProducts } from "@/lib/admin-api";
import ProductTable from "@/components/admin/ProductTable";
import {
  ErrorState,
  LoadingState,
  PageIntro,
  Panel,
  PrimaryButton,
} from "@/components/admin/AdminUi";

export default function ProductsManager({ initialCategory = "" }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(
    CATEGORIES.some((item) => item.value === initialCategory) ? initialCategory : "",
  );
  const [availability, setAvailability] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getProducts({ category: category || undefined, signal: controller.signal })
      .then((items) => {
        setProducts(items);
        setError("");
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [category, reload]);

  const refresh = useCallback(() => {
    setLoading(true);
    setReload((value) => value + 1);
  }, []);

  const visibleProducts = products
    .filter((product) => product.name?.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((product) => availability === "" || String(Boolean(product.available)) === availability)
    .sort((a, b) => {
      if (sort === "name") return String(a.name).localeCompare(String(b.name));
      if (sort === "price-low") return Number(a.price) - Number(b.price);
      if (sort === "price-high") return Number(b.price) - Number(a.price);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <>
      <PageIntro
        eyebrow="Catalogue"
        title="Products"
        description="Search, filter, and update the items listed in your school canteen."
        action={<Link href="/admin/products/new"><PrimaryButton><Plus size={17} />Add product</PrimaryButton></Link>}
      />
      <Panel>
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(145px,0.45fr))]">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8378]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-3 text-sm outline-none focus:border-[var(--c-caramel)] focus:ring-2 focus:ring-[var(--c-caramel)]/15" />
          </label>
          <label className="text-xs font-bold text-[#746d64]">
            <span className="sr-only">Filter by category</span>
            <select value={category} onChange={(event) => { setLoading(true); setCategory(event.target.value); }} className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-[var(--c-espresso)] outline-none focus:border-[var(--c-caramel)]">
              <option value="">All categories</option>
              {CATEGORIES.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#746d64]">
            <span className="sr-only">Filter by availability</span>
            <select value={availability} onChange={(event) => setAvailability(event.target.value)} className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-[var(--c-espresso)] outline-none focus:border-[var(--c-caramel)]">
              <option value="">All availability</option>
              <option value="true">Available</option>
              <option value="false">Out of stock</option>
            </select>
          </label>
          <label className="text-xs font-bold text-[#746d64]">
            <span className="sr-only">Sort products</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-[var(--c-espresso)] outline-none focus:border-[var(--c-caramel)]">
              <option value="newest">Newest first</option>
              <option value="name">Name A–Z</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>
        {loading ? (
          <LoadingState label="Loading products..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : (
          <>
            <p className="mb-3 text-xs text-[#746d64]">{visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"}</p>
            <ProductTable products={visibleProducts} onChanged={refresh} emptyDescription={search || availability ? "Try changing or clearing your current filters." : "Add a product to make it available in your canteen catalogue."} />
          </>
        )}
      </Panel>
    </>
  );
}
