"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Product, PaginatedResponse } from "@/types";

interface UseProductsParams {
  page?: number;
  limit?: number;
  categoryId?: number | null;
}

export const useProducts = ({ page = 1, limit = 10, categoryId }: UseProductsParams) => {
  return useQuery({
    queryKey: ["products", page, limit, categoryId],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const params: Record<string, number> = {
        limit,
        offset,
      };
      if (categoryId) {
        params.id_kategori = categoryId;
      }

      const { data } = await api.get<PaginatedResponse<Product>>("/products/", {
        params,
      });
      return data;
    },
  });
};
