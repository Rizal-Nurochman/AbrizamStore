"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface DetailPembelian {
  ID: number;
  id_produk: number;
  id_pembelian: number;
  harga_beli: number;
  jumlah: number;
  subtotal: number;
  Produk: {
    ID: number;
    nama_produk: string;
    foto_produk?: string;
  };
}

interface PembelianDetail {
  ID: number;
  CreatedAt: string;
  total_pembelian: number;
  id_user: number;
  DetailPembelian: DetailPembelian[];
}

export const usePembelianDetail = (id: number | null) => {
  return useQuery({
    queryKey: ["pembelian-detail", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get<{ data: PembelianDetail }>(`/pembelian/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};
