"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Loader2, Save } from "lucide-react";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";
import { FIXED_CATEGORIES } from "@/constants/categories";
import { Product } from "@/types";

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditProductModal({ product, isOpen, onClose, onSuccess }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    nama_produk: "",
    harga_beli: 0,
    harga_jual: 0,
    stok: 0,
    id_kategori: 0,
    foto_produk: "",
  });

  const updateProduct = useUpdateProduct();

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        nama_produk: product.nama_produk,
        harga_beli: product.harga_beli,
        harga_jual: product.harga_jual,
        stok: product.stok,
        id_kategori: product.id_kategori,
        foto_produk: product.foto_produk || "",
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      await updateProduct.mutateAsync({
        id: product.ID,
        data: formData,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Edit Produk</h2>
                    <p className="text-sm text-gray-500">Update informasi produk</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/80 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Nama Produk */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    value={formData.nama_produk}
                    onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Harga Beli & Jual */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Beli
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>
                      <input
                        type="number"
                        value={formData.harga_beli || ""}
                        onChange={(e) => setFormData({ ...formData, harga_beli: e.target.value === "" ? 0 : parseInt(e.target.value) })}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        required
                        min={0}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Jual
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>
                      <input
                        type="number"
                        value={formData.harga_jual || ""}
                        onChange={(e) => setFormData({ ...formData, harga_jual: e.target.value === "" ? 0 : parseInt(e.target.value) })}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        required
                        min={0}
                      />
                    </div>
                  </div>
                </div>

                {/* Stok */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stok
                  </label>
                  <input
                    type="number"
                    value={formData.stok || ""}
                    onChange={(e) => setFormData({ ...formData, stok: e.target.value === "" ? 0 : parseInt(e.target.value) })}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                    min={0}
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.id_kategori}
                    onChange={(e) => setFormData({ ...formData, id_kategori: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value={0}>Pilih Kategori</option>
                    {FIXED_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Foto Produk URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Foto Produk (Opsional)
                  </label>
                  <input
                    type="url"
                    value={formData.foto_produk}
                    onChange={(e) => setFormData({ ...formData, foto_produk: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                {/* Preview */}
                {formData.foto_produk && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview Foto
                    </label>
                    <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden">
                      <img
                        src={formData.foto_produk}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </form>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <motion.button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={updateProduct.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-violet-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {updateProduct.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
