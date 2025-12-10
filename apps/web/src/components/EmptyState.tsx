"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";

// You might want to replace the image src with an actual asset or different illustration
export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-64 h-64 bg-violet-50 rounded-full flex items-center justify-center mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-100/50 to-transparent" />
        <div className="text-9xl">🥡</div>
        {/* Or use an image if available: <Image src="/empty-state.svg" width={200} height={200} alt="Empty" /> */}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Belum ada barang di warungmu
      </h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        Mulai isi stok warungmu dengan menambahkan barang dagangan pertamamu sekarang!
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: ["0 0 0 0 rgba(124, 58, 237, 0)", "0 0 0 20px rgba(124, 58, 237, 0)"],
        }}
        transition={{
          boxShadow: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }
        }}
        className="flex items-center gap-2 bg-violet-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-violet-200 hover:shadow-2xl hover:shadow-violet-300 transition-all"
      >
        <Plus className="w-5 h-5" />
        Tambah Barang
      </motion.button>
    </motion.div>
  );
}
