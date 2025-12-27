"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface DetailPenjualan {
  ID: number;
  id_produk: number;
  id_penjualan: number;
  harga_jual: number;
  jumlah: number;
  subtotal: number;
  Produk: {
    ID: number;
    nama_produk: string;
    foto_produk?: string;
  };
}

interface PenjualanDetail {
  ID: number;
  CreatedAt: string;
  total_penjualan: number;
  id_user: number;
  DetailPenjualan: DetailPenjualan[];
}

export const usePenjualanDetail = (id: number | null) => {
  return useQuery({
    queryKey: ["penjualan-detail", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get<{ data: PenjualanDetail }>(`/penjualan/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};
