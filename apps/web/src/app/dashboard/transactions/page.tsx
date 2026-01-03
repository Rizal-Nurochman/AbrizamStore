"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  ShoppingCart,
  PackagePlus,
  Calendar,
  TrendingUp,
  TrendingDown,
  Loader2,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2
} from "lucide-react";
import { usePenjualan } from "@/hooks/usePenjualan";
import { usePembelian } from "@/hooks/usePembelian";
import { useDeletePenjualan } from "@/hooks/useDeletePenjualan";
import { useDeletePembelian } from "@/hooks/useDeletePembelian";
import { TransactionDetailModal } from "@/components/TransactionDetailModal";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";

type TabType = "all" | "penjualan" | "pembelian";

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [penjualanPage, setPenjualanPage] = useState(1);
  const [pembelianPage, setPembelianPage] = useState(1);

  // Modal state
  const [selectedTransaction, setSelectedTransaction] = useState<{
    id: number;
    type: "penjualan" | "pembelian";
  } | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    type: "penjualan" | "pembelian";
  } | null>(null);

  const { data: penjualanData, isLoading: penjualanLoading } = usePenjualan({ page: penjualanPage, limit: 10 });
  const { data: pembelianData, isLoading: pembelianLoading } = usePembelian({ page: pembelianPage, limit: 10 });

  // Delete mutations
  const deletePenjualan = useDeletePenjualan();
  const deletePembelian = useDeletePembelian();

  const penjualanList = penjualanData?.penjualans || [];
  const pembelianList = pembelianData?.pembelians || [];
  const penjualanTotal = penjualanData?.total || 0;
  const pembelianTotal = pembelianData?.total || 0;

  const isLoading = penjualanLoading || pembelianLoading;
  const isDeleting = deletePenjualan.isPending || deletePembelian.isPending;

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
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handle transaction click
  const handleTransactionClick = (id: number, type: "penjualan" | "pembelian") => {
    setSelectedTransaction({ id, type });
  };

  // Handle delete click
  const handleDeleteClick = (e: React.MouseEvent, id: number, type: "penjualan" | "pembelian") => {
    e.stopPropagation();
    setDeleteTarget({ id, type });
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "penjualan") {
        await deletePenjualan.mutateAsync(deleteTarget.id);
      } else {
        await deletePembelian.mutateAsync(deleteTarget.id);
      }
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  // Combine and sort transactions for "all" tab
  const allTransactions = [
    ...penjualanList.map(p => ({ ...p, type: "penjualan" as const })),
    ...pembelianList.map(p => ({ ...p, type: "pembelian" as const })),
  ].sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());

  const tabs = [
    { id: "all" as const, label: "Semua", icon: ClipboardList },
    { id: "penjualan" as const, label: "Penjualan", icon: TrendingUp },
    { id: "pembelian" as const, label: "Pembelian", icon: TrendingDown },
  ];

  const penjualanTotalPages = Math.ceil(penjualanTotal / 10);
  const pembelianTotalPages = Math.ceil(pembelianTotal / 10);

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
          <p className="text-sm text-gray-500">Klik transaksi untuk melihat detail produk</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Penjualan</p>
              <p className="text-2xl font-bold text-gray-900">{penjualanTotal}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pembelian</p>
              <p className="text-2xl font-bold text-gray-900">{pembelianTotal}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all relative ${activeTab === tab.id
                ? "text-violet-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === "all" && (
              <motion.div
                key="all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {allTransactions.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center">
                    <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Belum ada transaksi</p>
                  </div>
                ) : (
                  allTransactions.map((transaction) => (
                    <motion.div
                      key={`${transaction.type}-${transaction.ID}`}
                      layout
                      onClick={() => handleTransactionClick(transaction.ID, transaction.type)}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${transaction.type === "penjualan"
                          ? "bg-green-100"
                          : "bg-orange-100"
                          }`}>
                          {transaction.type === "penjualan" ? (
                            <ShoppingCart className="w-6 h-6 text-green-600" />
                          ) : (
                            <PackagePlus className="w-6 h-6 text-orange-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {transaction.type === "penjualan" ? "Penjualan" : "Pembelian"} #{transaction.ID}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${transaction.type === "penjualan"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                              }`}>
                              {transaction.type === "penjualan" ? "Penjualan" : "Restock"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(transaction.CreatedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`text-lg font-bold ${transaction.type === "penjualan"
                              ? "text-green-600"
                              : "text-orange-600"
                              }`}>
                              {transaction.type === "penjualan" ? "+" : "-"}
                              {formatCurrency(
                                transaction.type === "penjualan"
                                  ? (transaction as typeof penjualanList[0]).total_penjualan
                                  : (transaction as typeof pembelianList[0]).total_pembelian
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-5 h-5 text-violet-500" />
                            <button
                              onClick={(e) => handleDeleteClick(e, transaction.ID, transaction.type)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "penjualan" && (
              <motion.div
                key="penjualan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {penjualanList.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Belum ada transaksi penjualan</p>
                  </div>
                ) : (
                  <>
                    {penjualanList.map((transaction) => (
                      <motion.div
                        key={transaction.ID}
                        layout
                        onClick={() => handleTransactionClick(transaction.ID, "penjualan")}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              Penjualan #{transaction.ID}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(transaction.CreatedAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-lg font-bold text-green-600">
                              +{formatCurrency(transaction.total_penjualan)}
                            </p>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="w-5 h-5 text-green-500" />
                              <button
                                onClick={(e) => handleDeleteClick(e, transaction.ID, "penjualan")}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Pagination */}
                    {penjualanTotalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                          onClick={() => setPenjualanPage(p => Math.max(1, p - 1))}
                          disabled={penjualanPage === 1}
                          className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                          Halaman {penjualanPage} dari {penjualanTotalPages}
                        </span>
                        <button
                          onClick={() => setPenjualanPage(p => Math.min(penjualanTotalPages, p + 1))}
                          disabled={penjualanPage === penjualanTotalPages}
                          className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {activeTab === "pembelian" && (
              <motion.div
                key="pembelian"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {pembelianList.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center">
                    <PackagePlus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Belum ada transaksi pembelian</p>
                  </div>
                ) : (
                  <>
                    {pembelianList.map((transaction) => (
                      <motion.div
                        key={transaction.ID}
                        layout
                        onClick={() => handleTransactionClick(transaction.ID, "pembelian")}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                            <PackagePlus className="w-6 h-6 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              Pembelian #{transaction.ID}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(transaction.CreatedAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-lg font-bold text-orange-600">
                              -{formatCurrency(transaction.total_pembelian)}
                            </p>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="w-5 h-5 text-orange-500" />
                              <button
                                onClick={(e) => handleDeleteClick(e, transaction.ID, "pembelian")}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Pagination */}
                    {pembelianTotalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                          onClick={() => setPembelianPage(p => Math.max(1, p - 1))}
                          disabled={pembelianPage === 1}
                          className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                          Halaman {pembelianPage} dari {pembelianTotalPages}
                        </span>
                        <button
                          onClick={() => setPembelianPage(p => Math.min(pembelianTotalPages, p + 1))}
                          disabled={pembelianPage === pembelianTotalPages}
                          className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transactionId={selectedTransaction?.id || null}
        transactionType={selectedTransaction?.type || null}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={`Hapus ${deleteTarget?.type === "penjualan" ? "Penjualan" : "Pembelian"}?`}
        message="Transaksi yang dihapus tidak dapat dikembalikan. Namun, stok produk tidak akan berubah karena perubahan stok sudah tercatat sebelumnya."
      />
    </>
  );
}
