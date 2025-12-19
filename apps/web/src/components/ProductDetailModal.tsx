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
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Image */}
              <div className="relative">
                <div className="h-36 bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center overflow-hidden">
                  {product.foto_produk ? (
                    <img
                      src={product.foto_produk}
                      alt={product.nama_produk}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-violet-300">
                      <Package className="w-16 h-16" />
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>

                {/* Stock Badge */}
                <div className="absolute bottom-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg ${product.stok > 10
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
              <div className="p-4 space-y-3 overflow-y-auto max-h-[40vh]">
                {/* Product Name */}
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  {product.nama_produk}
                </h2>

                {/* Price Info */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Harga Beli */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-0.5">
                      <Banknote className="w-3.5 h-3.5" />
                      <span>Harga Beli</span>
                    </div>
                    <p className="text-sm font-bold text-gray-700">
                      {formatRupiah(product.harga_beli)}
                    </p>
                  </div>

                  {/* Harga Jual */}
                  <div className="bg-violet-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-violet-600 text-xs mb-0.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Harga Jual</span>
                    </div>
                    <p className="text-sm font-bold text-violet-600">
                      {formatRupiah(product.harga_jual)}
                    </p>
                  </div>
                </div>

                {/* Margin */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-green-600 text-xs">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Keuntungan</span>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full font-medium">
                      +{marginPercentage}%
                    </span>
                  </div>
                  <p className="text-base font-bold text-green-600 mt-0.5">
                    {formatRupiah(margin)}
                  </p>
                </div>

                {/* Dates */}
                <div className="border-t border-gray-100 pt-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Dibuat: {formatDate(product.CreatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Diupdate: {formatDate(product.UpdatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 text-sm"
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
