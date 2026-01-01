"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Category } from "@/types";

interface KategoriResponse {
  data: {
    kategoris: Category[];
  };
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<KategoriResponse>("/kategori/");
      return data.data.kategoris;
    },
  });
};
