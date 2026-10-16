"use client";

import { useEffect, useState } from "react";
import { ImagePlus, LoaderCircle, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { CATEGORIES, uploadProductImage } from "@/lib/admin-api";
import { Panel, PrimaryButton, SecondaryLink } from "./AdminUi";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProductForm({ initialProduct, onSave, saving }) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialProduct?.image || "");
  const [formError, setFormError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(
    () => () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim() || "";
    const category = formData.get("category")?.toString() || "";
    const price = Number(formData.get("price"));
    if (!name || !category || !Number.isFinite(price) || price <= 0) {
      setFormError("Enter a product name, choose a category, and set a price above zero.");
      return;
    }

    try {
      setUploadingImage(Boolean(imageFile));
      const image = imageFile ? await uploadProductImage(imageFile) : initialProduct?.image || "";
      await onSave({
        name,
        category,
        price,
        description: formData.get("description")?.toString().trim() || "",
        image,
        available: formData.get("available") === "on",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save this product.";
      setFormError(message);
    } finally {
      setUploadingImage(false);
    }
  }

  function handleImageChange(event) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      event.currentTarget.value = "";
      toast.error("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      event.currentTarget.value = "";
      toast.error("Product images must be 5 MB or smaller.");
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--c-caramel)] focus:ring-2 focus:ring-[var(--c-caramel)]/15";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Panel title="Product details" description="Add the information customers need to choose this item.">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-bold">
            Product name <span className="text-red-600">*</span>
            <input
              className={inputClass}
              name="name"
              defaultValue={initialProduct?.name || ""}
              placeholder="e.g. Chicken burger"
              maxLength={120}
              required
            />
          </label>
          <label className="text-sm font-bold">
            Category <span className="text-red-600">*</span>
            <select className={inputClass} name="category" defaultValue={initialProduct?.category?.value || initialProduct?.category || ""} required>
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold sm:col-span-2">
            Price (BDT) <span className="text-red-600">*</span>
            <input
              className={inputClass}
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              defaultValue={initialProduct?.price ?? ""}
              placeholder="0.00"
              required
            />
          </label>
          <label className="text-sm font-bold sm:col-span-2">
            Description
            <textarea
              className={`${inputClass} min-h-28 resize-y`}
              name="description"
              defaultValue={initialProduct?.description || ""}
              placeholder="Add a short description (optional)"
              maxLength={1000}
            />
          </label>
        </div>
      </Panel>

      <Panel title="Product image" description="JPG, PNG, or WebP up to 5 MB. Image delivery is configured for Cloudinary.">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            role={previewUrl ? "img" : undefined}
            aria-label={previewUrl ? "Product image preview" : undefined}
            className="grid size-32 shrink-0 place-items-center overflow-hidden rounded-2xl border border-dashed border-black/15 bg-[#f8f5f0] text-[#9a8f82]"
            style={previewUrl ? { backgroundImage: `url("${previewUrl}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          >
            {!previewUrl && <ImagePlus size={30} />}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-bold transition hover:border-[var(--c-caramel)]">
              <Upload size={17} />
              Choose image
              <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
            </label>
            {imageFile && (
              <button type="button" onClick={() => { setImageFile(null); setPreviewUrl(initialProduct?.image || ""); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#746d64] hover:bg-black/5">
                <X size={16} /> Remove selection
              </button>
            )}
            <p className="basis-full text-xs leading-5 text-[#746d64]">
              {imageFile?.name || (initialProduct?.image ? "Current product image" : "Optional. Configure Cloudinary before uploading a file.")}
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="Availability" description="Out-of-stock products can remain listed but won't be available to order.">
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-black/5 bg-[#fcfaf7] p-4">
          <span>
            <span className="block text-sm font-bold">Available to order</span>
            <span className="mt-1 block text-xs text-[#746d64]">Turn this off when the item is out of stock.</span>
          </span>
          <input
            name="available"
            type="checkbox"
            defaultChecked={initialProduct?.available ?? true}
            className="size-5 accent-[var(--c-teal)]"
          />
        </label>
      </Panel>

      {formError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {formError}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <SecondaryLink href="/admin/products">Cancel</SecondaryLink>
        <PrimaryButton type="submit" disabled={saving || uploadingImage}>
          {saving || uploadingImage ? <LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" /> : null}
          {uploadingImage ? "Uploading image..." : saving ? "Saving..." : initialProduct ? "Save changes" : "Add Product"}
        </PrimaryButton>
      </div>
    </form>
  );
}
