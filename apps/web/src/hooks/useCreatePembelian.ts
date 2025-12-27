"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

interface RestockItem {
  id_produk: number;
  jumlah: number;
  harga_beli: number;
}

interface CreatePembelianInput {
  items: RestockItem[];
}

export const useCreatePembelian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePembelianInput) => {
      const { data } = await api.post("/pembelian/", input);
      return data;
    },
    onSuccess: () => {
      // Invalidate products query to refetch updated stock
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
