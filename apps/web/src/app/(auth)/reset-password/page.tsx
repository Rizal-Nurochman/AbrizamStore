"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Key, ArrowLeft } from "lucide-react";

import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordValues) => {
      const response = await api.post("/auth/reset-password", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully");
      router.push("/login");
    },
    onError: (error: Error | any) => {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  const onSubmit = (data: ResetPasswordValues) => {
    mutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-indigo-600">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-indigo-900">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your verification code and new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Verification Code</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="token"
                placeholder="Enter code from email"
                className="pl-10"
                {...form.register("token")}
                disabled={mutation.isPending}
              />
            </div>
            {form.formState.errors.token && (
              <p className="text-sm text-red-500">
                {form.formState.errors.token.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="new_password"
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                {...form.register("new_password")}
                disabled={mutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {form.formState.errors.new_password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.new_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirm_password"
                type={showPassword ? "text" : "password"}
                className="pl-10"
                {...form.register("confirm_password")}
                disabled={mutation.isPending}
              />
            </div>
            {form.formState.errors.confirm_password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.confirm_password.message}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            type="submit"
            isLoading={mutation.isPending}
          >
            Reset Password
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link
          href="/login"
          className="flex items-center text-sm text-indigo-600 hover:underline font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
}
