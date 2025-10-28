"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.Role !== "user") {
      router.replace("/kasir");
    }
  }, [user, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.Role === "user") {
    return <>{children}</>;
  }
  
  return null;
}