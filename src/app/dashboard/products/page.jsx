"use client";

import { useState, useEffect } from "react";
import { Search, Boxes, Trash2, Edit3, Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Loading states for individual card actions
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch products from Express backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Handle Delete
  async function handleDelete(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeletingId(null);
    }
  }

  // Handle Submit Update Modal Form
  async function handleUpdateSubmit(e) {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch(`http://localhost:5000/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: editingProduct.productName,
          price: parseFloat(editingProduct.price),
          category: editingProduct.category,
          stock: parseInt(editingProduct.stock, 10),
        }),
      });

      if (response.ok) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? editingProduct : p))
        );
        setEditingProduct(null);
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  // Categories extraction
  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Filter products by search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#E8E1D7] px-4 py-8 text-[#3A1A14] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header & Search */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#3A1A14] sm:text-3xl">Admin Menu Management</h1>
            <p className="text-xs text-[#3A1A14]/70 sm:text-sm mt-0.5">Manage, update, and delete catalogue items.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#A8743F]" />
            <input
              type="text"
              placeholder="Search food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#A8743F]/25 bg-white/70 pl-10 pr-4 text-xs sm:text-sm text-[#3A1A14] placeholder-[#3A1A14]/40 outline-none transition focus:border-[#A8743F] focus:bg-white focus:ring-2 focus:ring-[#A8743F]/20"
            />
          </div>
        </div>

        {/* Categories Horizontal Filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#2F3F3F] text-[#E8E1D7] shadow-sm"
                  : "bg-white/50 text-[#3A1A14]/80 hover:bg-[#2F3F3F]/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skeleton Loading Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="animate-pulse rounded-2xl bg-white/40 p-3 sm:p-4 border border-[#3A1A14]/10">
                <div className="mb-3 h-32 sm:h-36 w-full rounded-xl bg-[#3A1A14]/10"></div>
                <div className="h-4 w-4/5 rounded bg-[#3A1A14]/10 mb-2"></div>
                <div className="h-3 w-2/5 rounded bg-[#3A1A14]/10 mb-3"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 w-12 rounded bg-[#3A1A14]/10"></div>
                  <div className="h-7 w-20 rounded bg-[#3A1A14]/10"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/40 py-16 text-center border border-[#3A1A14]/10">
            <Boxes className="h-10 w-10 text-[#A8743F] mb-2 opacity-70" />
            <p className="text-base font-bold text-[#3A1A14]">No food items found</p>
            <p className="text-xs text-[#3A1A14]/60 mt-0.5">Try searching with a different keyword.</p>
          </div>
        ) : (
          /* Products Grid with Edit & Delete Options */
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group flex flex-col justify-between rounded-2xl bg-white/80 p-3.5 sm:p-4 shadow-xs border border-[#3A1A14]/10 transition-all duration-200 hover:shadow-md hover:border-[#A8743F]/60"
              >
                <div>
                  <div className="relative mb-3 h-32 sm:h-36 w-full overflow-hidden rounded-xl bg-[#2F3F3F]/5 flex items-center justify-center transition group-hover:bg-[#2F3F3F]/10">
                    <Boxes className="h-8 w-8 text-[#2F3F3F]/30" />
                    <span className="absolute top-2 left-2 rounded-md bg-[#2F3F3F]/90 px-2 py-0.5 text-[9px] font-medium text-[#E8E1D7]">
                      {product.category || "General"}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-[#3A1A14] line-clamp-1">
                    {product.productName}
                  </h3>
                  
                  <p className="text-[10px] sm:text-xs text-[#3A1A14]/60 mt-0.5">
                    Stock: <span className="font-medium text-[#3A1A14]">{product.stock}</span>
                  </p>
                </div>

                {/* Price & Action Buttons */}
                <div className="mt-4 flex items-center justify-between border-t border-[#3A1A14]/10 pt-2.5">
                  <span className="text-sm sm:text-base font-bold text-[#A8743F]">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Edit Button */}
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="flex items-center justify-center p-1.5 rounded-lg bg-[#2F3F3F]/10 text-[#2F3F3F] transition hover:bg-[#2F3F3F] hover:text-[#E8E1D7]"
                      title="Edit Product"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(product._id, product.productName)}
                      disabled={deletingId === product._id}
                      className="flex items-center justify-center p-1.5 rounded-lg bg-red-500/10 text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                      title="Delete Product"
                    >
                      {deletingId === product._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-2xl bg-[#E8E1D7] p-6 shadow-xl border border-[#3A1A14]/20">
              <h2 className="text-lg font-bold text-[#3A1A14] mb-4">Update Product</h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#3A1A14]/80">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.productName}
                    onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#A8743F]/30 bg-white p-2.5 text-xs outline-none focus:border-[#A8743F]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#3A1A14]/80">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#A8743F]/30 bg-white p-2.5 text-xs outline-none focus:border-[#A8743F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#3A1A14]/80">Stock</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#A8743F]/30 bg-white p-2.5 text-xs outline-none focus:border-[#A8743F]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#3A1A14]/80">Category</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#A8743F]/30 bg-white p-2.5 text-xs outline-none focus:border-[#A8743F]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-[#3A1A14] hover:bg-black/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 rounded-xl bg-[#2F3F3F] px-4 py-2 text-xs font-bold text-[#E8E1D7] transition hover:bg-[#3A1A14]"
                  >
                    {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}