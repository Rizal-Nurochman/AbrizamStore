"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      const { token, user } = data.data;
      Cookies.set("Authorization", token, { expires: 0.5 });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful!");
      router.push("/");
    },
    onError: (error: any, variables) => {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);

      if (message.includes("email belum diverifikasi")) {
        setTimeout(() => {
          router.push(`/verify-email?email=${variables.email}`);
        }, 1500);
      }
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (data: { code: string }) => {
      const response = await api.post("/auth/google-login", data);
      return response.data;
    },
    onSuccess: (data) => {
      const { token, user } = data.data;
      Cookies.set("Authorization", token, { expires: 0.5 });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Google Login successful!");
      router.push("/");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Google login failed";
      toast.error(message);
    },
  });

  const loginWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: (codeResponse) => {
      googleLoginMutation.mutate({
        code: codeResponse.code,
      });
    },
    onError: () => {
      toast.error("Google Login Failed");
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-indigo-600">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-indigo-900">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your email to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" onClick={() => loginWithGoogle()} className="w-full">
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign in with Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="pl-10"
                {...form.register("email")}
                disabled={loginMutation.isPending}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                {...form.register("password")}
                disabled={loginMutation.isPending}
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
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button className="w-full" type="submit" isLoading={loginMutation.isPending}>
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
