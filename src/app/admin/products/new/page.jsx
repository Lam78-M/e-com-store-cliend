"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createProduct } from "@/lib/admin-api";
import ProductForm from "@/components/admin/ProductForm";
import { PageIntro } from "@/components/admin/AdminUi";

export default function NewProductPage() {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function save(product) {
    setSaving(true);
    try {
      await createProduct(product);
      toast.success("Product added successfully.");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add product.");
      throw error;
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageIntro eyebrow="Catalogue" title="Add a product" description="Add a canteen item with a clear category, price, and availability." />
      <div className="max-w-4xl"><ProductForm onSave={save} saving={saving} /></div>
    </>
  );
}
