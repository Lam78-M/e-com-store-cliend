"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Edit3 } from "lucide-react";
import { useParams } from "next/navigation";
import { CATEGORIES, getProduct } from "@/lib/admin-api";
import { AvailabilityBadge, ErrorState, LoadingState, PageIntro, Panel, PrimaryButton, formatDate, formatPrice } from "@/components/admin/AdminUi";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getProduct(id, { signal: controller.signal })
      .then(setProduct)
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  const categoryValue = typeof product?.category === "string" ? product.category : product?.category?.value;
  const category = CATEGORIES.find((item) => item.value === categoryValue)?.label || product?.category?.label || categoryValue || "—";

  return (
    <>
      <PageIntro eyebrow="Catalogue" title={product?.name || "Product details"} description="Product information from the catalogue API." action={<Link href="/admin/products"><span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-bold"><ArrowLeft size={16} />Products</span></Link>} />
      {loading ? <LoadingState label="Loading product..." /> : error ? <ErrorState message={error} /> : (
        <Panel className="max-w-4xl">
          <div className="grid gap-7 md:grid-cols-[240px_minmax(0,1fr)]">
            <div role={product.image ? "img" : undefined} aria-label={product.image ? `${product.name} image` : undefined} className="aspect-square rounded-2xl bg-[#f0e7db] bg-cover bg-center" style={product.image ? { backgroundImage: `url("${product.image}")` } : undefined} />
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><p className="text-sm font-semibold text-[var(--c-caramel)]">{category}</p><h2 className="mt-1 text-2xl font-extrabold">{product.name}</h2></div>
                <Link href={`/admin/products/${id}/edit`}><PrimaryButton><Edit3 size={16} />Edit product</PrimaryButton></Link>
              </div>
              <p className="mt-5 text-2xl font-extrabold">{formatPrice(product.price)}</p>
              <div className="mt-4"><AvailabilityBadge available={Boolean(product.available)} /></div>
              <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-[#625b52]">{product.description || "No description provided."}</p>
              <p className="mt-6 text-xs text-[#81796f]">Added {formatDate(product.createdAt)}</p>
            </div>
          </div>
        </Panel>
      )}
    </>
  );
}
