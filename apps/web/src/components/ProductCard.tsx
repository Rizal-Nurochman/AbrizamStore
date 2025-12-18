"use client";

import { Product } from "@/types";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  // Format currency
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-violet-100 transition-all duration-300 border border-transparent hover:border-violet-100"
    >
      <div className="aspect-square rounded-xl bg-gray-50 mb-4 flex items-center justify-center overflow-hidden group-hover:bg-violet-50 transition-colors">
        {product.foto_produk ? (
          <img
            src={product.foto_produk}
            alt={product.nama_produk}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-violet-200 group-hover:text-violet-400 transition-colors">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-violet-700 transition-colors">
            {product.nama_produk}
          </h3>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="font-bold text-violet-600 text-lg">
            {formatRupiah(product.harga_jual)}
          </p>
          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            Stok: {product.stok}
          </span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-violet-600 text-white p-2 rounded-full shadow-lg shadow-violet-200"
      >
        <ShoppingBag className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
