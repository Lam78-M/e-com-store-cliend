"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit3, Eye, LoaderCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteProduct, updateProduct } from "@/lib/admin-api";
import { AvailabilityBadge, EmptyState, formatDate, formatPrice } from "./AdminUi";

function productId(product) {
  return product._id || product.id;
}

function ConfirmDialog({ product, busy, onCancel, onConfirm }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-4" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !busy) onCancel();
    }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="delete-product-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <span className="grid size-11 place-items-center rounded-xl bg-red-50 text-red-700"><Trash2 size={20} /></span>
        <h2 id="delete-product-title" className="mt-4 text-lg font-extrabold">Delete {product.name}?</h2>
        <p className="mt-2 text-sm leading-6 text-[#746d64]">This action will permanently remove this product from the catalogue.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" disabled={busy} onClick={onCancel} className="min-h-10 rounded-xl border border-black/10 px-4 text-sm font-bold hover:bg-black/5 disabled:opacity-50">Cancel</button>
          <button type="button" disabled={busy} onClick={onConfirm} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-red-700 px-4 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50">
            {busy && <LoaderCircle size={15} className="animate-spin motion-reduce:animate-none" />}
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}

export default function ProductTable({ products, onChanged, emptyDescription = "Add your first product to start building the canteen catalogue." }) {
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  async function confirmDelete() {
    const id = productId(pendingDelete);
    if (!id) {
      toast.error("This product is missing its database ID.");
      return;
    }
    setBusy(true);
    try {
      await deleteProduct(id);
      toast.success("Product deleted.");
      setPendingDelete(null);
      onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete product.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleAvailability(product) {
    const id = productId(product);
    if (!id) {
      toast.error("This product is missing its database ID.");
      return;
    }
    try {
      await updateProduct(id, { available: !product.available });
      toast.success(`${product.name} availability updated.`);
      onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update availability.");
    }
  }

  if (!products.length) {
    return <EmptyState title="No products found" description={emptyDescription} />;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-black/5">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f5f0] text-xs uppercase tracking-wide text-[#746d64]">
            <tr>
              <th className="px-4 py-3 font-bold">Product</th>
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 font-bold">Price</th>
              <th className="px-4 py-3 font-bold">Availability</th>
              <th className="px-4 py-3 font-bold">Added</th>
              <th className="px-4 py-3 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {products.map((product, index) => {
              const id = productId(product);
              const category = product.category?.label || product.category || "—";
              return (
                <tr key={id || `${product.name}-${index}`} className="bg-white transition-colors hover:bg-[#fcfaf7]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        role={product.image ? "img" : undefined}
                        aria-label={product.image ? `${product.name} image` : undefined}
                        className="size-11 shrink-0 rounded-xl border border-black/5 bg-[#f0e7db] bg-cover bg-center"
                        style={product.image ? { backgroundImage: `url("${product.image}")` } : undefined}
                      />
                      <span className="font-bold">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#625b52]">{category}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toggleAvailability(product)} title="Click to change availability" className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-caramel)]">
                      <AvailabilityBadge available={Boolean(product.available)} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[#746d64]">{formatDate(product.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/products/${id}`} aria-label={`View ${product.name}`} title="View" className="rounded-lg p-2 text-[#625b52] hover:bg-[#f0e7db] hover:text-[var(--c-teal)]"><Eye size={17} /></Link>
                      <Link href={`/admin/products/${id}/edit`} aria-label={`Edit ${product.name}`} title="Edit" className="rounded-lg p-2 text-[#625b52] hover:bg-[#f0e7db] hover:text-[var(--c-teal)]"><Edit3 size={17} /></Link>
                      <button type="button" onClick={() => setPendingDelete(product)} aria-label={`Delete ${product.name}`} title="Delete" className="rounded-lg p-2 text-[#625b52] hover:bg-red-50 hover:text-red-700"><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ConfirmDialog product={pendingDelete} busy={busy} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />
    </>
  );
}
