"use client";

import { useState } from "react";
import { CirclePlus, Tags } from "lucide-react";
import { DashboardPageHeader, dashboardPanelClass } from "../_components/DashboardContent";
import { categories as startingCategories } from "../_components/dashboard-data";

export default function CategoriesPage() {
  const [categories, setCategories] = useState(startingCategories);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");

  function addCategory(event) {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) return;
    if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
      setMessage("That category already exists.");
      return;
    }
    setCategories((current) => [...current, { name, products: 0, color: "bg-[#f2f3ef] text-[#65736a]" }]);
    setCategoryName("");
    setMessage("Category added to this preview. Connect the category API to save it.");
  }

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Catalogue organisation"
        title="Categories"
        description="Group products so customers can find canteen favourites."
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
        <section className={`${dashboardPanelClass} p-5 sm:p-6`}>
          <h2 className="mb-4 text-base font-extrabold text-[#28332f]">All categories</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center gap-3 rounded-xl border border-[#f0f0eb] p-3">
                <span className={`grid size-10 place-items-center rounded-xl ${category.color}`}>
                  <Tags size={17} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 text-sm font-bold text-[#3c4942]">{category.name}</span>
                <span className="text-xs text-[#89928c]">{category.products} products</span>
              </div>
            ))}
          </div>
        </section>
        <section className={`${dashboardPanelClass} h-fit p-5 sm:p-6`}>
          <h2 className="text-base font-extrabold text-[#28332f]">Add category</h2>
          <p className="mt-2 text-xs leading-5 text-[#7e8982]">Create a category for grouping your store products.</p>
          <form className="mt-5 space-y-4" onSubmit={addCategory}>
            <label className="block text-xs font-bold text-[#536159]">
              Category name
              <input
                required
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="e.g. Breakfast"
                className="mt-2 h-11 w-full rounded-xl border border-[#e4e6e0] bg-[#fdfdfb] px-3 text-sm font-normal outline-none focus:border-[#789582] focus:ring-4 focus:ring-[#789582]/10"
              />
            </label>
            {message && <p role="status" className="text-xs text-[#81734f]">{message}</p>}
            <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#263e39] px-4 text-sm font-bold text-white transition hover:bg-[#1b302a]">
              <CirclePlus size={16} aria-hidden="true" />
              Add category
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
