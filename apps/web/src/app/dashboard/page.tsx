"use client";

import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { AddProductModal } from "@/components/AddProductModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { Product } from "@/types";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, ChevronDown, Loader2, Plus } from "lucide-react";

const LIMIT_OPTIONS = [10, 20, 50] as const;

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1); // Reset to page 1 on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset to page 1 when limit changes
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Fetch Categories
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  // Fetch Products
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    page,
    limit,
    categoryId: activeCategoryId,
    search: searchQuery,
  });

  const products = productsData?.data || [];
  const meta = productsData?.meta;

  const handleCategorySelect = (id: number | null) => {
    setActiveCategoryId(id);
    setPage(1); // Reset to page 1 on category change
  };

  const handleNextPage = () => {
    if (meta && page < meta.total_page) {
      setPage((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Katalog Produk</h1>
          <p className="text-gray-500 mt-1">Kelola dan pantau stok barang daganganmu.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm transition-shadow shadow-sm hover:shadow-md"
              placeholder="Cari produk..."
            />
          </div>

          {/* Limit Selector */}
          <div className="relative">
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer transition-colors shadow-sm hover:shadow-md"
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} produk
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <motion.button
            onClick={handleOpenAddModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-violet-200 hover:bg-violet-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Tambah Barang
          </motion.button>
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
                  <ProductCard
                    key={product.ID}
                    product={product}
                    index={index}
                    onClick={handleProductClick}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {meta && meta.total_page > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-gray-600">
                  Halaman {page} dari {meta.total_page}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === meta.total_page}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState onAddProduct={handleOpenAddModal} />
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}

