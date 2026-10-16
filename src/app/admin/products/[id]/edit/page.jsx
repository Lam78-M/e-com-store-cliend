"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getProduct, updateProduct } from "@/lib/admin-api";
import ProductForm from "@/components/admin/ProductForm";
import { ErrorState, LoadingState, PageIntro } from "@/components/admin/AdminUi";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getProduct(id, { signal: controller.signal })
      .then((record) => {
        setProduct(record);
        setError("");
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id, reload]);

  const retry = useCallback(() => {
    setLoading(true);
    setReload((value) => value + 1);
  }, []);

  async function save(changes) {
    setSaving(true);
    try {
      await updateProduct(id, changes);
      toast.success("Product updated successfully.");
      router.push("/admin/products");
      router.refresh();
    } catch (requestError) {
      toast.error(requestError instanceof Error ? requestError.message : "Could not update product.");
      throw requestError;
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageIntro eyebrow="Catalogue" title="Edit product" description="Update product details, image, or availability." />
      {loading ? <LoadingState label="Loading product..." /> : error ? <ErrorState message={error} onRetry={retry} /> : (
        <div className="max-w-4xl"><ProductForm key={product._id || product.id || id} initialProduct={product} onSave={save} saving={saving} /></div>
      )}
    </>
  );
}
