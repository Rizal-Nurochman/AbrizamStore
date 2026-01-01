"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingCart,
  PackagePlus,
  Calendar,
  Package,
  Loader2
} from "lucide-react";
import { usePenjualanDetail } from "@/hooks/usePenjualanDetail";
import { usePembelianDetail } from "@/hooks/usePembelianDetail";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: number | null;
  transactionType: "penjualan" | "pembelian" | null;
}

export function TransactionDetailModal({
  isOpen,
  onClose,
  transactionId,
  transactionType
}: TransactionDetailModalProps) {
  const { data: penjualanData, isLoading: penjualanLoading } = usePenjualanDetail(
    transactionType === "penjualan" ? transactionId : null
  );
  const { data: pembelianData, isLoading: pembelianLoading } = usePembelianDetail(
    transactionType === "pembelian" ? transactionId : null
  );

  const isLoading = penjualanLoading || pembelianLoading;
  const data = transactionType === "penjualan" ? penjualanData : pembelianData;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isPenjualan = transactionType === "penjualan";
  const details = isPenjualan
    ? (penjualanData?.DetailPenjualan || [])
    : (pembelianData?.DetailPembelian || []);
  const total = isPenjualan
    ? penjualanData?.total_penjualan
    : pembelianData?.total_pembelian;

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b border-gray-100 ${isPenjualan ? "bg-gradient-to-r from-green-50 to-emerald-50" : "bg-gradient-to-r from-orange-50 to-amber-50"
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPenjualan ? "bg-green-100" : "bg-orange-100"
                    }`}>
                    {isPenjualan ? (
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    ) : (
                      <PackagePlus className="w-6 h-6 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {isPenjualan ? "Detail Penjualan" : "Detail Pembelian"} #{transactionId}
                    </h2>
                    {data && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(data.CreatedAt)}</span>
                      </div>
                    )}
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
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                  </div>
                ) : details.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <Package className="w-12 h-12 mb-2" />
                    <p>Tidak ada detail produk</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Daftar Produk ({details.length} item)
                    </h3>
                    {details.map((item, index) => (
                      <motion.div
                        key={item.ID}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-3">
                          {/* Product Image */}
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${isPenjualan ? "bg-green-100" : "bg-orange-100"
                            }`}>
                            {item.Produk?.foto_produk ? (
                              <img
                                src={item.Produk.foto_produk}
                                alt={item.Produk.nama_produk}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className={`w-6 h-6 ${isPenjualan ? "text-green-400" : "text-orange-400"}`} />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.Produk?.nama_produk || "Produk tidak ditemukan"}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                              <span>{item.jumlah} x {formatCurrency('harga_jual' in item ? item.harga_jual : item.harga_beli)}</span>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right">
                            <p className={`font-bold ${isPenjualan ? "text-green-600" : "text-orange-600"}`}>
                              {formatCurrency(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer - Total */}
              {!isLoading && details.length > 0 && (
                <div className={`p-6 border-t border-gray-100 ${isPenjualan ? "bg-gradient-to-r from-green-50 to-emerald-50" : "bg-gradient-to-r from-orange-50 to-amber-50"
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Total {isPenjualan ? "Penjualan" : "Pembelian"}</span>
                    <span className={`text-2xl font-bold ${isPenjualan ? "text-green-600" : "text-orange-600"}`}>
                      {formatCurrency(total || 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
