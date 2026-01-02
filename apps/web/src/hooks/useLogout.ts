"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint
      const token = Cookies.get("Authorization") || localStorage.getItem("token");
      if (token) {
        await api.post("/auth/logout");
      }
    } catch (error) {
      console.error("Logout backend call failed:", error);
      // Continue cleanup even if backend fails
    }

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear cookie
    Cookies.remove("Authorization");

    // Clear all React Query cache to prevent stale user data
    queryClient.clear();

    // Redirect to login
    router.push("/login");
    router.refresh();
  }, [queryClient, router]);

  return { logout };
}
