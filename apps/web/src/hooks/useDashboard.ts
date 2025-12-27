"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface DashboardSummary {
  today_omzet: number;
  today_transaksi: number;
  weekly_omzet: number;
  weekly_transaksi: number;
  monthly_omzet: number;
  monthly_transaksi: number;
}

interface TopProduct {
  nama_produk: string;
  total_terjual: number;
}

interface SalesTrendItem {
  date: string;
  total_omzet: number;
}

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const { data } = await api.get<{ data: DashboardSummary }>("/dashboard/summary");
      return data.data;
    },
  });
};

export const useTopProducts = () => {
  return useQuery({
    queryKey: ["top-products"],
    queryFn: async () => {
      const { data } = await api.get<{ data: TopProduct[] }>("/dashboard/top-products");
      return data.data;
    },
  });
};

export const useSalesTrend = () => {
  return useQuery({
    queryKey: ["sales-trend"],
    queryFn: async () => {
      const { data } = await api.get<{ data: SalesTrendItem[] }>("/dashboard/sales-trend");
      return data.data;
    },
  });
};
