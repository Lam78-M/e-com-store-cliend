"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Boxes, Plus, Tags } from "lucide-react";
import { CATEGORIES, getProducts } from "@/lib/admin-api";
import { EmptyState, ErrorState, LoadingState, PageIntro, Panel, PrimaryButton } from "@/components/admin/AdminUi";

function categoryValue(value) {
  if (typeof value === "string") return value;
  return value?.value || value?.slug || "";
}

function CategoryStatus({ count }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${count ? "bg-emerald-50 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
      {count ? "Active" : "No products"}
    </span>
  );
}

export default function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getProducts({ signal: controller.signal })
      .then(setProducts)
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const counts = products.reduce((result, product) => {
    const key = categoryValue(product.category);
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});

  return (
    <>
      <PageIntro
        eyebrow="Catalogue"
        title="Categories"
        description="Keep your products organized with a consistent set of canteen categories."
        action={<Link href="/admin/products/new"><PrimaryButton><Plus size={17} />Add product</PrimaryButton></Link>}
      />
      <Panel title="Product categories" description="Categories are stored as a product field and can be filtered through the products API.">
        {loading ? <LoadingState label="Loading category counts..." /> : error ? <ErrorState message={error} /> : (
          <div className="overflow-x-auto rounded-xl border border-black/5">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="bg-[#f8f5f0] text-xs uppercase tracking-wide text-[#746d64]">
                <tr><th className="px-4 py-3 font-bold">Category</th><th className="px-4 py-3 font-bold">Products</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 text-right font-bold">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {CATEGORIES.map((category) => {
                  const count = counts[category.value] || 0;
                  return (
                    <tr key={category.value} className="hover:bg-[#fcfaf7]">
                      <td className="px-4 py-4"><span className="flex items-center gap-3 font-bold"><span className="grid size-9 place-items-center rounded-xl bg-[#f0e7db] text-[var(--c-caramel)]"><Tags size={17} /></span>{category.label}</span></td>
                      <td className="px-4 py-4 text-[#625b52]"><span className="inline-flex items-center gap-1.5"><Boxes size={15} />{count}</span></td>
                      <td className="px-4 py-4"><CategoryStatus count={count} /></td>
                      <td className="px-4 py-4 text-right"><Link href={`/admin/products?category=${encodeURIComponent(category.value)}`} className="text-sm font-bold text-[var(--c-caramel)] hover:underline">View products</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <div className="mt-4"><EmptyState title="No products yet" description="Categories are ready. Add a product to see category counts here." /></div>
        )}
      </Panel>
    </>
  );
}
