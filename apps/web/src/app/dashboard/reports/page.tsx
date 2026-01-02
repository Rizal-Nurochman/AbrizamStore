"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  DollarSign,
  Download,
  Calendar,
  Loader2,
  AlertTriangle,
  Info
} from "lucide-react";
import { useProfitLossReport } from "@/hooks/useReports";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportsPage() {
  // Date range - default last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [startDate, setStartDate] = useState(thirtyDaysAgo.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

  // Fetch profit/loss report
  const { data: profitData, isLoading, error } = useProfitLossReport(startDate, endDate);

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

  // Export to PDF with complete product details
  const exportToPDF = () => {
    if (!profitData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("LAPORAN LABA RUGI", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`, pageWidth / 2, 28, { align: "center" });

    // Summary section
    doc.setFontSize(11);
    doc.text(`Total Modal: ${formatCurrency(profitData.total_modal)}`, 14, 45);
    doc.text(`Total Penjualan: ${formatCurrency(profitData.total_penjualan)}`, 14, 52);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Laba Bersih: ${formatCurrency(profitData.total_laba)}`, 14, 59);
    doc.text(`Margin Rata-rata: ${profitData.margin_rata_rata.toFixed(1)}%`, 14, 66);
    doc.setFont("helvetica", "normal");

    // Detailed product table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Detail Produk Terjual", 14, 80);

    autoTable(doc, {
      startY: 85,
      head: [["No", "Nama Produk", "Qty", "Harga Beli", "Harga Jual", "Total Modal", "Total Penjualan", "Laba"]],
      body: profitData.items?.map((item, index) => [
        index + 1,
        item.nama_produk,
        item.jumlah_terjual,
        formatCurrency(item.harga_beli),
        formatCurrency(item.harga_jual),
        formatCurrency(item.total_modal),
        formatCurrency(item.total_penjualan),
        formatCurrency(item.laba),
      ]) || [],
      foot: [[
        "",
        "TOTAL",
        "",
        "",
        "",
        formatCurrency(profitData.total_modal),
        formatCurrency(profitData.total_penjualan),
        formatCurrency(profitData.total_laba)
      ]],
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [139, 92, 246], textColor: 255, fontStyle: "bold" },
      footStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 35 },
        2: { cellWidth: 12, halign: "center" },
        3: { cellWidth: 22, halign: "right" },
        4: { cellWidth: 22, halign: "right" },
        5: { cellWidth: 25, halign: "right" },
        6: { cellWidth: 25, halign: "right" },
        7: { cellWidth: 25, halign: "right" },
      },
    });

    // Footer with profit info
    const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 197, 94);
    doc.text(`LABA BERSIH: ${formatCurrency(profitData.total_laba)}`, 14, finalY + 15);

    if (profitData.produk_paling_untung) {
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Produk Paling Menguntungkan: ${profitData.produk_paling_untung} (${formatCurrency(profitData.laba_tertinggi)})`, 14, finalY + 25);
    }

    doc.save(`laporan-laba-rugi-${startDate}-${endDate}.pdf`);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan Laba Rugi</h1>
            <p className="text-sm text-gray-500">Analisis keuntungan warung Anda</p>
          </div>
        </div>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToPDF}
          disabled={isLoading || !profitData}
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

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-200">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal memuat data</h3>
          <p className="text-sm text-red-600">Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>
        </div>
      ) : !profitData ? (
        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum ada data</h3>
          <p className="text-sm text-gray-500">Data tidak tersedia untuk periode ini.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-violet-600" />
                Detail Produk Terjual
              </h3>
              <p className="text-sm text-gray-500 mt-1">Klik &quot;Export PDF&quot; untuk menyimpan laporan lengkap</p>
            </div>
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
                  {(!profitData.items || profitData.items.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Belum ada produk terjual pada periode ini
                      </td>
                    </tr>
                  )}
                </tbody>
                {profitData.items && profitData.items.length > 0 && (
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">TOTAL</td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-orange-600">{formatCurrency(profitData.total_modal)}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">{formatCurrency(profitData.total_penjualan)}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-green-600">{formatCurrency(profitData.total_laba)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
