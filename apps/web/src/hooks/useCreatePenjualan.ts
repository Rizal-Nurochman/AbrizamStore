"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

interface CartItem {
  id_produk: number;
  jumlah: number;
}

interface CreatePenjualanInput {
  items: CartItem[];
}

export const useCreatePenjualan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePenjualanInput) => {
      const { data } = await api.post("/penjualan/", input);
      return data;
    },
    onSuccess: () => {
      // Invalidate products query to refetch updated stock
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
