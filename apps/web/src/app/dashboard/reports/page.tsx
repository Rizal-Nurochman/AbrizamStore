"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  TrendingUp,
  DollarSign,
  Package,
  Download,
  Calendar,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useSalesReport, useProfitLossReport, useStockReport } from "@/hooks/useReports";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type TabType = "sales" | "profit" | "stock";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("sales");
  const [expandedSalesIds, setExpandedSalesIds] = useState<Set<number>>(new Set());

  // Date range - default last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [startDate, setStartDate] = useState(thirtyDaysAgo.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

  // Fetch reports
  const { data: salesData, isLoading: salesLoading, error: salesError } = useSalesReport(startDate, endDate);
  const { data: profitData, isLoading: profitLoading } = useProfitLossReport(startDate, endDate);
  const { data: stockData, isLoading: stockLoading } = useStockReport();

  const isLoading = salesLoading || profitLoading || stockLoading;

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
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.text("Laporan Warungku", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`, pageWidth / 2, 28, { align: "center" });

    if (activeTab === "sales" && salesData) {
      doc.setFontSize(14);
      doc.text("Laporan Penjualan", 14, 40);

      // Summary section
      const labaBersih = profitData?.total_laba || 0;
      doc.setFontSize(10);
      doc.text(`Total Omzet: ${formatCurrency(salesData.total_omzet)}`, 14, 50);
      doc.text(`Total Transaksi: ${salesData.total_transaksi}`, 14, 56);
      doc.text(`Laba Bersih: ${formatCurrency(labaBersih)}`, 14, 62);

      // Build table body with product details
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tableBody: any[][] = [];
      salesData.items?.forEach((item, index) => {
        // Main transaction row
        tableBody.push([
          index + 1,
          formatDate(item.tanggal),
          "",
          "",
          "",
          formatCurrency(item.total_penjualan),
        ]);
        // Detail rows for each product
        if (item.details && item.details.length > 0) {
          item.details.forEach((detail) => {
            tableBody.push([
              "",
              "",
              detail.nama_produk,
              detail.jumlah,
              formatCurrency(detail.harga_jual),
              formatCurrency(detail.subtotal),
            ]);
          });
        }
      });

      autoTable(doc, {
        startY: 70,
        head: [["No", "Tanggal", "Produk", "Qty", "Harga", "Subtotal/Total"]],
        body: tableBody,
        foot: [["", "TOTAL", "", "", "", formatCurrency(salesData.total_omzet)]],
        styles: { fontSize: 8 },
        headStyles: { fillColor: [139, 92, 246] },
        footStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: "bold" },
      });

      // Add laba bersih at the bottom
      const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`LABA BERSIH: ${formatCurrency(labaBersih)}`, 14, finalY + 10);
    } else if (activeTab === "profit" && profitData) {
      doc.setFontSize(14);
      doc.text("Laporan Laba Rugi", 14, 40);

      autoTable(doc, {
        startY: 45,
        head: [["Produk", "Terjual", "Modal", "Penjualan", "Laba"]],
        body: profitData.items?.map((item) => [
          item.nama_produk,
          item.jumlah_terjual,
          formatCurrency(item.total_modal),
          formatCurrency(item.total_penjualan),
          formatCurrency(item.laba),
        ]),
        foot: [["TOTAL", "", formatCurrency(profitData.total_modal), formatCurrency(profitData.total_penjualan), formatCurrency(profitData.total_laba)]],
      });
    } else if (activeTab === "stock" && stockData) {
      doc.setFontSize(14);
      doc.text("Laporan Stok (Inventory Valuation)", 14, 40);

      autoTable(doc, {
        startY: 45,
        head: [["Produk", "Stok", "Nilai Modal", "Nilai Jual", "Potensial Laba", "Status"]],
        body: stockData.items?.map((item) => [
          item.nama_produk,
          item.stok,
          formatCurrency(item.nilai_modal),
          formatCurrency(item.nilai_jual),
          formatCurrency(item.potensial_laba),
          item.status === "habis" ? "Habis" : item.status === "menipis" ? "Menipis" : "Aman",
        ]),
        foot: [["TOTAL", stockData.total_stok, formatCurrency(stockData.total_nilai_modal), formatCurrency(stockData.total_nilai_jual), formatCurrency(stockData.total_potensial_laba), ""]],
      });
    }

    doc.save(`laporan-${activeTab}-${startDate}-${endDate}.pdf`);
  };


  const tabs = [
    { id: "sales" as const, label: "Penjualan", icon: TrendingUp, color: "green" },
    { id: "profit" as const, label: "Laba Rugi", icon: DollarSign, color: "blue" },
    { id: "stock" as const, label: "Stok", icon: Package, color: "orange" },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan Bisnis</h1>
            <p className="text-sm text-gray-500">Pahami kondisi keuangan warung Anda</p>
          </div>
        </div>

        {/* Export Button - PDF Only */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToPDF}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </motion.button>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Periode:</span>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <span className="text-gray-400">s/d</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
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
                  layoutId="activeReportTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* Sales Report */}
          {activeTab === "sales" && (
            <motion.div
              key="sales"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {salesError ? (
                <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-200">
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal memuat data</h3>
                  <p className="text-sm text-red-600">Terjadi kesalahan saat mengambil data penjualan. Silakan coba lagi.</p>
                </div>
              ) : !salesData ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum ada data</h3>
                  <p className="text-sm text-gray-500">Data penjualan tidak tersedia untuk periode ini.</p>
                </div>
              ) : (
                <>
                  {/* Explanation Card */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 mb-6 border border-green-100">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-800 mb-1">Apa itu Laporan Penjualan?</h3>
                        <p className="text-sm text-green-700">
                          Laporan ini menunjukkan <strong>total uang yang masuk</strong> dari penjualan barang.
                          Omzet adalah jumlah total uang yang Anda terima dari pelanggan. Semakin tinggi omzet, semakin banyak barang yang terjual.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Total Omzet</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(salesData.total_omzet)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Jumlah Transaksi</p>
                      <p className="text-2xl font-bold text-gray-900">{salesData.total_transaksi}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Rata-rata Harian</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(salesData.rata_rata_harian)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                      <p className="text-sm text-emerald-600 mb-1">Laba Bersih</p>
                      <p className="text-2xl font-bold text-emerald-600">{formatCurrency(profitData?.total_laba || 0)}</p>
                      <p className="text-xs text-emerald-500 mt-1">Keuntungan ✨</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Hari Terbaik</p>
                      <p className="text-lg font-bold text-gray-900">{salesData.hari_terbaik ? formatDate(salesData.hari_terbaik) : "-"}</p>
                      <p className="text-sm text-green-600">{formatCurrency(salesData.omzet_terbaik)}</p>
                    </div>
                  </div>


                  {/* Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-8"></th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tanggal</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Produk</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Qty</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Harga</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Subtotal</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesData.items?.map((item, index) => {
                            const isExpanded = expandedSalesIds.has(item.id);
                            const hasDetails = item.details && item.details.length > 0;
                            const toggleExpand = () => {
                              setExpandedSalesIds(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(item.id)) {
                                  newSet.delete(item.id);
                                } else {
                                  newSet.add(item.id);
                                }
                                return newSet;
                              });
                            };

                            return (
                              <React.Fragment key={item.id}>
                                {/* Main transaction row */}
                                <tr
                                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${hasDetails ? "cursor-pointer hover:bg-violet-50 transition-colors" : ""}`}
                                  onClick={hasDetails ? toggleExpand : undefined}
                                >
                                  <td className="px-4 py-3 text-sm">
                                    {hasDetails && (
                                      <button className="text-gray-400 hover:text-violet-600 transition-colors">
                                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                      </button>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{formatDate(item.tanggal)}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500">
                                    {hasDetails ? `${item.jumlah_item} produk` : "-"}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-center text-gray-600">-</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-600">-</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-600">-</td>
                                  <td className="px-4 py-3 text-sm text-right font-bold text-green-600">{formatCurrency(item.total_penjualan)}</td>
                                </tr>
                                {/* Expanded detail rows */}
                                {isExpanded && hasDetails && item.details?.map((detail, detailIndex) => (
                                  <tr key={`${item.id}-${detailIndex}`} className="bg-violet-50/50">
                                    <td className="px-4 py-2"></td>
                                    <td className="px-4 py-2"></td>
                                    <td className="px-4 py-2 text-sm text-gray-700">
                                      <span className="pl-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                                        {detail.nama_produk}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-600">{detail.jumlah}</td>
                                    <td className="px-4 py-2 text-sm text-right text-gray-600">{formatCurrency(detail.harga_jual)}</td>
                                    <td className="px-4 py-2 text-sm text-right font-medium text-violet-600">{formatCurrency(detail.subtotal)}</td>
                                    <td className="px-4 py-2"></td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Profit/Loss Report */}
          {activeTab === "profit" && profitData && (
            <motion.div
              key="profit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Explanation Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Apa itu Laba Rugi?</h3>
                    <p className="text-sm text-blue-700">
                      <strong>Modal</strong> = Uang yang Anda keluarkan untuk beli barang dari supplier.<br />
                      <strong>Penjualan</strong> = Uang yang Anda terima dari pelanggan.<br />
                      <strong>Laba</strong> = Penjualan - Modal. Ini adalah <strong>keuntungan bersih</strong> Anda!
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Total Modal</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(profitData.total_modal)}</p>
                  <p className="text-xs text-gray-400 mt-1">Uang yang dikeluarkan</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Total Penjualan</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(profitData.total_penjualan)}</p>
                  <p className="text-xs text-gray-400 mt-1">Uang yang masuk</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <p className="text-sm text-green-600 mb-1">Total Laba</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(profitData.total_laba)}</p>
                  <p className="text-xs text-green-500 mt-1">Keuntungan bersih ✨</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Margin Rata-rata</p>
                  <p className="text-2xl font-bold text-violet-600">{profitData.margin_rata_rata.toFixed(1)}%</p>
                  <p className="text-xs text-gray-400 mt-1">Persentase keuntungan</p>
                </div>
              </div>

              {/* Best Product */}
              {profitData.produk_paling_untung && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 mb-6 border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="text-sm text-amber-700">Produk Paling Menguntungkan</p>
                      <p className="font-bold text-amber-900">{profitData.produk_paling_untung} - Laba {formatCurrency(profitData.laba_tertinggi)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Produk</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Terjual</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Modal</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Penjualan</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Laba</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profitData.items?.map((item, index) => (
                        <tr key={item.nama_produk} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.nama_produk}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-600">{item.jumlah_terjual}</td>
                          <td className="px-4 py-3 text-sm text-right text-orange-600">{formatCurrency(item.total_modal)}</td>
                          <td className="px-4 py-3 text-sm text-right text-blue-600">{formatCurrency(item.total_penjualan)}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">{formatCurrency(item.laba)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stock Report */}
          {activeTab === "stock" && stockData && (
            <motion.div
              key="stock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Explanation Card */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 mb-6 border border-orange-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-orange-800 mb-1">Apa itu Inventory Valuation (Nilai Stok)?</h3>
                    <p className="text-sm text-orange-700">
                      <strong>Nilai Modal</strong> = Jumlah uang yang &quot;tertanam&quot; di stok barang (Stok × Harga Beli).<br />
                      <strong>Nilai Jual</strong> = Potensi uang jika semua barang terjual (Stok × Harga Jual).<br />
                      <strong>Potensial Laba</strong> = Keuntungan yang bisa didapat jika semua terjual.
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Total Produk</p>
                  <p className="text-2xl font-bold text-gray-900">{stockData.total_produk}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Nilai Modal Tertanam</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(stockData.total_nilai_modal)}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Nilai Jual Potensial</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(stockData.total_nilai_jual)}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <p className="text-sm text-green-600 mb-1">Potensial Laba</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stockData.total_potensial_laba)}</p>
                </div>
              </div>

              {/* Stock Alerts */}
              {(stockData.produk_hampir_habis > 0 || stockData.produk_habis > 0) && (
                <div className="flex gap-4 mb-6">
                  {stockData.produk_habis > 0 && (
                    <div className="flex-1 bg-red-50 rounded-xl p-4 border border-red-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-800">{stockData.produk_habis} Produk Habis</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">Perlu restock segera!</p>
                    </div>
                  )}
                  {stockData.produk_hampir_habis > 0 && (
                    <div className="flex-1 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">{stockData.produk_hampir_habis} Produk Menipis</span>
                      </div>
                      <p className="text-sm text-yellow-600 mt-1">Stok ≤ 10 unit</p>
                    </div>
                  )}
                </div>
              )}

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Produk</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Stok</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Nilai Modal</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Nilai Jual</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Potensial Laba</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.items?.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-gray-900">{item.nama_produk}</p>
                            <p className="text-xs text-gray-400">{item.kategori}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-center font-semibold text-gray-900">{item.stok}</td>
                          <td className="px-4 py-3 text-sm text-right text-orange-600">{formatCurrency(item.nilai_modal)}</td>
                          <td className="px-4 py-3 text-sm text-right text-blue-600">{formatCurrency(item.nilai_jual)}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">{formatCurrency(item.potensial_laba)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${item.status === "habis"
                              ? "bg-red-100 text-red-700"
                              : item.status === "menipis"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                              }`}>
                              {item.status === "habis" ? (
                                <><AlertTriangle className="w-3 h-3" /> Habis</>
                              ) : item.status === "menipis" ? (
                                <><AlertTriangle className="w-3 h-3" /> Menipis</>
                              ) : (
                                <><CheckCircle className="w-3 h-3" /> Aman</>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
