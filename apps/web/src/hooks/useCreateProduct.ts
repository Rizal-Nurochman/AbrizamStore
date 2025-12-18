"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

interface CreateProductInput {
  nama_produk: string;
  harga_beli: number;
  harga_jual: number;
  stok: number;
  kategori_id?: number | null;
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const { data } = await api.post("/products/", input);
      return data;
    },
    onSuccess: () => {
      // Invalidate products query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
