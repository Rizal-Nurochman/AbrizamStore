"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Product, PaginatedResponse } from "@/types";

interface UseProductsParams {
  page?: number;
  limit?: number;
  categoryId?: number | null;
  search?: string;
}

export const useProducts = ({ page = 1, limit = 10, categoryId, search }: UseProductsParams) => {
  return useQuery({
    queryKey: ["products", page, limit, categoryId, search],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const params: Record<string, string | number> = {
        limit,
        offset,
      };
      if (categoryId) {
        params.id_kategori = categoryId;
      }
      if (search && search.trim()) {
        params.nama_produk = search.trim();
      }

      const { data } = await api.get<PaginatedResponse<Product>>("/products/", {
        params,
      });
      return data;
    },
  });
};
