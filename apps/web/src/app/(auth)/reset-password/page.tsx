"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
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

function SuccessView() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-fade-in">

      <div className="rounded-full bg-green-100 p-3 mb-4">
        <svg
          className="w-16 h-16 text-green-600 animate-[bounce_1s_ease-in-out_1]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 text-center">
        Password Reset Successful!
      </h3>
      <p className="text-gray-500 text-center">
        Your password has been securely updated. Redirecting to login...
      </p>
    </div>
  );
}

// Separate component that uses search params
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Effect to validate token presence
  useEffect(() => {
    if (!tokenFromUrl) {
      toast.error("Invalid or missing reset token");
    }
  }, [tokenFromUrl]);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      token: tokenFromUrl,
      new_password: "",
      confirm_password: "",
    },
  });

  const {
    watch,
    formState: { errors, isValid, isDirty },
    setValue,
    handleSubmit,
    register,
  } = form;

  const newPassword = watch("new_password");
  const confirmPassword = watch("confirm_password");

  // Update form value if token comes in late
  useEffect(() => {
    if (tokenFromUrl) {
      setValue("token", tokenFromUrl);
    }
  }, [tokenFromUrl, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordValues) => {
      const response = await api.post("/auth/reset-password", data);
      return response.data;
    },
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message =
        (error as any).response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  const onSubmit = (data: ResetPasswordValues) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <Card className="w-full shadow-lg border-t-4 border-t-green-600">
        <SuccessView />
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-indigo-600">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-indigo-900">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden token field */}
          <input type="hidden" {...register("token")} />

          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="new_password"
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                {...register("new_password")}
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
            {/* Real-time validation feedback for New Password */}
            {newPassword && (
              <p
                className={`text-sm ${newPassword.length >= 8 ? "text-green-600" : "text-red-500"
                  }`}
              >
                {newPassword.length >= 8
                  ? "Password valid"
                  : "Password harus memiliki minimal 8 karakter"}
              </p>
            )}
            {errors.new_password && !newPassword && (
              <p className="text-sm text-red-500">{errors.new_password.message}</p>
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
                {...register("confirm_password")}
                disabled={mutation.isPending}
              />
            </div>
            {/* Real-time validation feedback for Confirm Password */}
            {confirmPassword && (
              <p
                className={`text-sm ${confirmPassword === newPassword && confirmPassword.length >= 8
                  ? "text-green-600"
                  : "text-red-500"
                  }`}
              >
                {confirmPassword === newPassword
                  ? "Password sesuai"
                  : "Password tidak sesuai"}
              </p>
            )}
            {errors.confirm_password && !confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirm_password.message}</p>
            )}
          </div>

          <Button
            className="w-full"
            type="submit"
            isLoading={mutation.isPending}
            disabled={!isValid || !isDirty || mutation.isPending}
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

// Main page component wrapped in Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
