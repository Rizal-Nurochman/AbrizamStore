"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { UpdateProfilePayload, User } from "@/types";

interface UpdateProfileResponse {
  status: boolean;
  message: string;
  data: User;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await api.put<UpdateProfileResponse>("/user/profile", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
