"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useDeletePenjualan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/penjualan/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["penjualan"] });
    },
  });
};
