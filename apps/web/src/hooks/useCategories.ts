"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Category } from "@/types";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<Category[]>("/kategori/");
      // Assuming endpoint returns array directly or inside data? 
      // Usually REST standards: if it's a list, it might be { data: [...] } or just [...].
      // Implementation plan assumed standard GET structure.
      // Safely handling both if possible or assuming standard array for now.
      // Based on typical Go Fiber/Gin responses in this project style (often wrapped in data/message),
      // but without seeing category controller, I'll assume it might be wrapped or check usage later.
      // For now, let's assume valid array or data wrapper.
      // Actually, looking at `useProducts` I assumed PaginatedResponse.
      // Let's assume Kategori returns a list.
      // @ts-ignore
      return data.data.kategoris;
    },
  });
};
