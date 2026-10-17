"use client";

import { useState } from "react";
import { Trash2, Edit3, Loader2 } from "lucide-react";

export default function ProductActions({ product, onDelete, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete handler
  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${product.productName}"?`)) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/products/${product._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onDelete(product._id); // Parent state theke remove korar jonno
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  // Update handler (Simple inline update trigger or modal opener)
  async function handleUpdateClick() {
    setIsUpdating(true);
    // Ekhane tumi update modal ba edit page-e redirecting logic boshte paro
    onUpdate(product);
    setIsUpdating(false);
  }

  return (
    <div className="flex items-center gap-2">
      {/* Update Button */}
      <button
        onClick={handleUpdateClick}
        disabled={isUpdating || isDeleting}
        className="flex items-center gap-1 rounded-lg bg-[#2F3F3F]/10 px-3 py-1.5 text-[11px] font-bold text-[#2F3F3F] transition hover:bg-[#2F3F3F] hover:text-[#E8E1D7] disabled:opacity-50"
      >
        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Edit3 className="h-3 w-3" />}
        Edit
      </button>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting || isUpdating}
        className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-[11px] font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
      >
        {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}