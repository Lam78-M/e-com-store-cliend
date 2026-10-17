"use client";

import { useState } from "react";
import { Boxes, CirclePlus } from "lucide-react";
import { DashboardPageHeader, dashboardPanelClass } from "../_components/DashboardContent";

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border border-[#e4e6e0] bg-[#fdfdfb] px-3 text-sm font-normal outline-none transition placeholder:text-[#aab0ab] focus:border-[#789582] focus:ring-4 focus:ring-[#789582]/10";

export default function UploadProductPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = event.target; // Sohoj vabe form ta dhorlam
    const formData = new FormData(form);
    
    const productData = {
      productName: formData.get("productName"),
      price: parseFloat(formData.get("price")),
      category: formData.get("category"),
      stock: parseInt(formData.get("stock"), 10),
    };

    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`"${productData.productName}" successfully added! 🎉`);
        form.reset(); // Ekdom sohoj vabe form reset
      } else {
        setMessage(data.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      setMessage("Server error! Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Catalogue management"
        title="Upload a product"
        description="Add a new item to the canteen catalogue."
        action="View products"
        actionHref="/dashboard/products"
      />
      <div className={`${dashboardPanelClass} max-w-3xl p-5 sm:p-7`}>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-xs font-bold text-[#536159]">
            Product name
            <input required name="productName" placeholder="e.g. Fresh fruit cup" className={fieldClass} />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-xs font-bold text-[#536159]">
              Price
              <span className="relative mt-2 block">
                <span className="absolute left-3 top-3 text-sm text-[#89938c]">$</span>
                <input required min="0" step="0.01" type="number" name="price" placeholder="0.00" className={`${fieldClass} mt-0 pl-7`} />
              </span>
            </label>
            <label className="block text-xs font-bold text-[#536159]">
              Category
              <select name="category" defaultValue="" required className={`${fieldClass} text-[#69756e]`}>
                <option value="" disabled>Select category</option>
                <option>Fresh snacks</option>
                <option>Drinks</option>
                <option>Lunch favourites</option>
                <option>Biscuits</option>
                <option>Fast Foods</option>
                <option>Chocolate</option>
                <option>Stationery</option>
              </select>
            </label>
          </div>
          <label className="block text-xs font-bold text-[#536159]">
            Stock quantity
            <input required min="0" step="1" type="number" name="stock" placeholder="0" className={fieldClass} />
          </label>
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#d8ded7] bg-[#fafbf8] px-4 text-center transition hover:border-[#9db2a2] hover:bg-[#f6f9f5]">
            <Boxes size={22} className="mb-2 text-[#789582]" aria-hidden="true" />
            <span className="text-xs font-bold text-[#596a60]">Choose product image</span>
            <span className="mt-1 text-[10px] text-[#9aa19c]">PNG or JPG · Image upload requires backend storage</span>
            <input name="image" type="file" accept="image/png,image/jpeg" className="sr-only" />
          </label>
          {message && (
            <p role="status" className="rounded-xl bg-[#fbf7ee] px-4 py-3 text-xs leading-5 text-[#81734f]">
              {message}
            </p>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#263e39] px-4 text-sm font-bold text-white transition hover:bg-[#1b302a] focus-visible:outline-none focus-visible:ring-2 focus-browser focus-visible:ring-[#b38a56] focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <CirclePlus size={16} aria-hidden="true" />
            {loading ? "Saving..." : "Save product"}
          </button>
        </form>
      </div>
    </div>
  );
}