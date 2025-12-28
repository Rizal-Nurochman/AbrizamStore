"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { Product } from "@/types";

interface DeleteProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteProductModal({ product, isOpen, onClose, onSuccess }: DeleteProductModalProps) {
  const deleteProduct = useDeleteProduct();

  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct.mutateAsync(product.ID);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
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
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Hapus Produk</h2>
                    <p className="text-sm text-gray-500">Konfirmasi penghapusan</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/80 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {product.foto_produk ? (
                      <img
                        src={product.foto_produk}
                        alt={product.nama_produk}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.nama_produk}</h3>
                    <p className="text-sm text-gray-500">Stok: {product.stok}</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-red-800 text-sm">
                    <strong>Peringatan:</strong> Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara permanen beserta semua data yang terkait.
                  </p>
                </div>
              </div>

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
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteProduct.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl shadow-lg shadow-red-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {deleteProduct.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      <span>Ya, Hapus Produk</span>
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
