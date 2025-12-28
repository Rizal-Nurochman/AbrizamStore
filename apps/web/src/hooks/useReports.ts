"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

// Types
interface SalesReportItem {
  id: number;
  tanggal: string;
  total_penjualan: number;
  jumlah_item: number;
}

interface SalesReportResponse {
  items: SalesReportItem[];
  total_omzet: number;
  total_transaksi: number;
  rata_rata_harian: number;
  hari_terbaik: string;
  omzet_terbaik: number;
}

interface ProfitLossItem {
  nama_produk: string;
  jumlah_terjual: number;
  harga_beli: number;
  harga_jual: number;
  total_modal: number;
  total_penjualan: number;
  laba: number;
}

interface ProfitLossResponse {
  items: ProfitLossItem[];
  total_modal: number;
  total_penjualan: number;
  total_laba: number;
  margin_rata_rata: number;
  produk_paling_untung: string;
  laba_tertinggi: number;
}

interface StockReportItem {
  id: number;
  nama_produk: string;
  stok: number;
  harga_beli: number;
  harga_jual: number;
  nilai_modal: number;
  nilai_jual: number;
  potensial_laba: number;
  kategori: string;
  status: string;
}

interface StockReportResponse {
  items: StockReportItem[];
  total_produk: number;
  total_stok: number;
  total_nilai_modal: number;
  total_nilai_jual: number;
  total_potensial_laba: number;
  produk_hampir_habis: number;
  produk_habis: number;
}

// Hooks
export const useSalesReport = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["sales-report", startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get<{ data: SalesReportResponse }>("/reports/sales", {
        params: { start_date: startDate, end_date: endDate },
      });
      return data.data;
    },
  });
};

export const useProfitLossReport = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["profit-loss-report", startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get<{ data: ProfitLossResponse }>("/reports/profit-loss", {
        params: { start_date: startDate, end_date: endDate },
      });
      return data.data;
    },
  });
};

export const useStockReport = () => {
  return useQuery({
    queryKey: ["stock-report"],
    queryFn: async () => {
      const { data } = await api.get<{ data: StockReportResponse }>("/reports/stock");
      return data.data;
    },
  });
};

// Export types
export type {
  SalesReportItem,
  SalesReportResponse,
  ProfitLossItem,
  ProfitLossResponse,
  StockReportItem,
  StockReportResponse
};
