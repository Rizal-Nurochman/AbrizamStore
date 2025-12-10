"use client";

import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  // Fetch Categories
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  // Fetch Products
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    page,
    limit: 10,
    categoryId: activeCategoryId,
  });

  const products = productsData?.data || [];
  const meta = productsData?.meta;

  const handleCategorySelect = (id: number | null) => {
    setActiveCategoryId(id);
    setPage(1); // Reset to page 1 on category change
  };

  const handleNextPage = () => {
    if (meta && page < meta.total_pages) {
      setPage((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Katalog Produk</h1>
          <p className="text-gray-500 mt-1">Kelola dan pantau stok barang daganganmu.</p>
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm transition-shadow shadow-sm hover:shadow-md"
            placeholder="Cari produk..."
          />
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-0 z-40 py-4 -mx-4 px-4 bg-[#F8F9FC]/80 backdrop-blur-md">
        {isLoadingCategories ? (
          <div className="flex gap-2 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-full" />
            ))}
          </div>
        ) : (
          <CategoryTabs
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleCategorySelect}
          />
        )}
      </div>

      {/* Main Content Area - Glassmorphism */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl shadow-gray-200/50 min-h-[500px] p-6">
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 h-[300px] border border-gray-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-violet-200 animate-spin" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <ProductCard key={product.ID} product={product} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {meta && meta.total_pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-gray-600">
                  Halaman {page} dari {meta.total_pages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === meta.total_pages}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
