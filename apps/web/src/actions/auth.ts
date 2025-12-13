"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;

  try {
    if (token) {
      // Attempt to call backend logout endpoint
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888"}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `Authorization=${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Logout backend call failed:", error);
    // Continue cleanup even if backend fails
  }

  // Always delete the cookie
  cookieStore.delete("Authorization");

  // Redirect to login
  redirect("/login");
}
