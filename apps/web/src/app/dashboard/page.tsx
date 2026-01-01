"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  Calendar,
  DollarSign,
  ShoppingBag,
  Package,
  Loader2,
  Trophy,
  BarChart3,
  Store
} from "lucide-react";
import { useDashboardSummary, useTopProducts, useSalesTrend } from "@/hooks/useDashboard";
import { useProfile } from "@/hooks/useProfile";

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: topProducts, isLoading: topProductsLoading } = useTopProducts();
  const { data: salesTrend, isLoading: trendLoading } = useSalesTrend();
  const { data: profile } = useProfile();

  const isLoading = summaryLoading || topProductsLoading || trendLoading;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date for chart
  const formatChartDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  // Calculate max for chart scaling
  const maxTrendValue = Math.max(...(salesTrend?.map(item => item.total_omzet) || [0]), 1);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Ringkasan analisis bisnis Anda</p>
          </div>
        </div>

        {/* Store Name Display */}
        {profile?.store_name && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100">
            <Store className="w-5 h-5 text-violet-600" />
            <span className="font-semibold text-violet-700">{profile.store_name}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Today */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Hari Ini
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(summary?.today_omzet || 0)}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShoppingBag className="w-4 h-4" />
                <span>{summary?.today_transaksi || 0} transaksi</span>
              </div>
            </motion.div>

            {/* This Week */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Minggu Ini
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(summary?.weekly_omzet || 0)}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShoppingBag className="w-4 h-4" />
                <span>{summary?.weekly_transaksi || 0} transaksi</span>
              </div>
            </motion.div>

            {/* This Month */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-violet-600" />
                </div>
                <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
                  Bulan Ini
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(summary?.monthly_omzet || 0)}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShoppingBag className="w-4 h-4" />
                <span>{summary?.monthly_transaksi || 0} transaksi</span>
              </div>
            </motion.div>
          </div>

          {/* Charts and Top Products Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Tren Penjualan</h3>
                  <p className="text-sm text-gray-500">7 hari terakhir</p>
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="h-48 flex items-end gap-2">
                {salesTrend && salesTrend.length > 0 ? (
                  salesTrend.map((item, index) => {
                    const height = (item.total_omzet / maxTrendValue) * 100;
                    return (
                      <motion.div
                        key={item.date}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(height, 5)}%` }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-full bg-gradient-to-t from-violet-500 to-indigo-500 rounded-t-lg relative group cursor-pointer"
                          style={{ height: "100%" }}
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {formatCurrency(item.total_omzet)}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 truncate w-full text-center">
                          {formatChartDate(item.date)}
                        </span>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Belum ada data penjualan</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Top Selling Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Produk Terlaris</h3>
                  <p className="text-sm text-gray-500">Top 5 paling banyak terjual</p>
                </div>
              </div>

              {topProducts && topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product, index) => {
                    const maxSold = Math.max(...topProducts.map(p => p.total_terjual), 1);
                    const percentage = (product.total_terjual / maxSold) * 100;

                    const medals = ["🥇", "🥈", "🥉"];
                    const medal = medals[index] || `${index + 1}.`;

                    return (
                      <motion.div
                        key={product.nama_produk}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{medal}</span>
                            <span className="font-medium text-gray-900 truncate max-w-[200px]">
                              {product.nama_produk}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-violet-600">
                            {product.total_terjual} terjual
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                            className={`h-full rounded-full ${index === 0
                              ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                              : index === 1
                                ? "bg-gradient-to-r from-gray-300 to-gray-400"
                                : index === 2
                                  ? "bg-gradient-to-r from-amber-600 to-amber-700"
                                  : "bg-gradient-to-r from-violet-400 to-indigo-500"
                              }`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <Package className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">Belum ada data produk terlaris</p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </>
  );
}
