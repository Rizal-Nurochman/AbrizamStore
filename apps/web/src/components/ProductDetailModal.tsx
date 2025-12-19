"use client";

import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Package, Calendar, Tag, Banknote, TrendingUp } from "lucide-react";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  // Format currency
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!product) return null;

  const margin = product.harga_jual - product.harga_beli;
  const marginPercentage = product.harga_beli > 0
    ? ((margin / product.harga_beli) * 100).toFixed(1)
    : "0";

  return (
    <AnimatePresence>
      {isOpen && (
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
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Image */}
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center overflow-hidden">
                  {product.foto_produk ? (
                    <img
                      src={product.foto_produk}
                      alt={product.nama_produk}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-violet-300">
                      <Package className="w-24 h-24" />
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Stock Badge */}
                <div className="absolute bottom-4 right-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg ${product.stok > 10
                      ? "bg-green-500 text-white"
                      : product.stok > 0
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                    }`}>
                    Stok: {product.stok}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[50vh]">
                {/* Product Name */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {product.nama_produk}
                  </h2>
                </div>

                {/* Price Info */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Harga Beli */}
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Banknote className="w-4 h-4" />
                      <span>Harga Beli</span>
                    </div>
                    <p className="text-lg font-bold text-gray-700">
                      {formatRupiah(product.harga_beli)}
                    </p>
                  </div>

                  {/* Harga Jual */}
                  <div className="bg-violet-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-violet-600 text-sm mb-1">
                      <Tag className="w-4 h-4" />
                      <span>Harga Jual</span>
                    </div>
                    <p className="text-lg font-bold text-violet-600">
                      {formatRupiah(product.harga_jual)}
                    </p>
                  </div>
                </div>

                {/* Margin */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>Keuntungan per Item</span>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                      +{marginPercentage}%
                    </span>
                  </div>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    {formatRupiah(margin)}
                  </p>
                </div>

                {/* Dates */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Dibuat: {formatDate(product.CreatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Diupdate: {formatDate(product.UpdatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
