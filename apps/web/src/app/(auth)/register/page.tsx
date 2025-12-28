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
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

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

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Watch password field to show real-time feedback
  const password = form.watch("password");

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Registration successful! Please check your email for verification code.");
      setTimeout(() => {
        router.push(`/verify-email?email=${variables.email}`);
      }, 1500);
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (error as any).response?.data?.message || "Something went wrong";
      toast.error(message);
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
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (error as any).response?.data?.message || "Google login failed";
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

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="animate-fade-in">
      <Card className="w-full shadow-2xl border-0 glass-card overflow-hidden">
        <CardHeader className="space-y-1 text-center pb-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create an account
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 p-6 sm:p-8 pt-0">
          <div className="animate-slide-up-delayed" style={{ animationDelay: '0.1s' }}>
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-11 relative bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 border-gray-200 dark:border-gray-700 hover:border-indigo-500/50"
            >
              <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Sign up with Google
            </Button>
          </div>

          <div className="relative animate-slide-up-delayed" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-gray-500 dark:text-gray-400 font-medium tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 animate-slide-up-delayed" style={{ animationDelay: '0.3s' }}>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-10 h-10 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-300"
                  {...form.register("name")}
                  disabled={registerMutation.isPending}
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 animate-slide-up">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="pl-10 h-10 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-300"
                  {...form.register("email")}
                  disabled={registerMutation.isPending}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 animate-slide-up">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 h-10 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-300"
                  {...form.register("password")}
                  disabled={registerMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* Visual Password Strength Indicator */}
              <div className="text-xs transition-all duration-300 h-4">
                <span className={`flex items-center gap-1 ${!password
                  ? "text-gray-500"
                  : password.length >= 8
                    ? "text-green-600 font-medium"
                    : "text-red-500"
                  }`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${!password ? "bg-gray-300" : password.length >= 8 ? "bg-green-500" : "bg-red-500"
                    }`}></span>
                  {password && password.length >= 8 ? "Good" : "Min 8 chars"}
                </span>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-500 animate-slide-up">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 mt-2"
              type="submit"
              isLoading={registerMutation.isPending}
            >
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 pb-6 sm:pb-8 pt-0 animate-slide-up-delayed" style={{ animationDelay: '0.4s' }}>
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold hover:underline transition-colors">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
