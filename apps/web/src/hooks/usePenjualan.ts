"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Penjualan } from "@/types";

interface PenjualanResponse {
  penjualans: Penjualan[];
  total: number;
}

interface UsePenjualanParams {
  page?: number;
  limit?: number;
}

export const usePenjualan = ({ page = 1, limit = 10 }: UsePenjualanParams = {}) => {
  return useQuery({
    queryKey: ["penjualan", page, limit],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const { data } = await api.get<{ data: PenjualanResponse }>("/penjualan/", {
        params: { limit, offset },
      });
      return data.data;
    },
  });
};
