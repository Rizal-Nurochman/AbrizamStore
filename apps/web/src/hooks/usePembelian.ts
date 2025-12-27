"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Pembelian } from "@/types";

interface PembelianResponse {
  pembelians: Pembelian[];
  total: number;
}

interface UsePembelianParams {
  page?: number;
  limit?: number;
}

export const usePembelian = ({ page = 1, limit = 10 }: UsePembelianParams = {}) => {
  return useQuery({
    queryKey: ["pembelian", page, limit],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const { data } = await api.get<{ data: PembelianResponse }>("/pembelian/", {
        params: { limit, offset },
      });
      return data.data;
    },
  });
};
