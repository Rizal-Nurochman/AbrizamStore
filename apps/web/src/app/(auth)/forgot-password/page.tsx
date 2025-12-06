"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";

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

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ForgotPasswordValues) => {
      const response = await api.post("/auth/forgot-password", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Verification code sent to your email");
    },
    onError: (error: Error | any) => {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    mutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-indigo-600">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-indigo-900">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email to receive a password reset code
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                disabled={mutation.isPending}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <Button
            className="w-full"
            type="submit"
            isLoading={mutation.isPending}
          >
            Send Reset Code
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
