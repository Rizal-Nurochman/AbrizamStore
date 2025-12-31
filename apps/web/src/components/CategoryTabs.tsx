"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FIXED_CATEGORIES } from "@/constants/categories";

interface CategoryTabsProps {
  activeCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export function CategoryTabs({ activeCategoryId, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto pb-4 no-scrollbar">
      <div className="flex gap-2 min-w-max px-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            "relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
            activeCategoryId === null ? "text-white" : "text-gray-600 hover:text-violet-600 bg-white/50 hover:bg-white"
          )}
        >
          {activeCategoryId === null && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-violet-600 rounded-full shadow-lg shadow-violet-200"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">Semua</span>
        </button>

        {FIXED_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              activeCategoryId === category.id ? "text-white" : "text-gray-600 hover:text-violet-600 bg-white/50 hover:bg-white"
            )}
          >
            {activeCategoryId === category.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-violet-600 rounded-full shadow-lg shadow-violet-200"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{category.nama_kategori}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

