"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User } from "@/types";

interface ProfileResponse {
  status: boolean;
  message: string;
  data: User;
}

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.get<ProfileResponse>("/user/profile");
      return data.data;
    },
  });
};
