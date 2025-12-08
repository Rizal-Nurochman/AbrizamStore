"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, KeyRound } from "lucide-react";
import { Suspense } from 'react'

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

const verifySchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().min(1, "Verification code is required"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    mode: "onChange",
    defaultValues: {
      email: defaultEmail,
      code: "",
    },
  });

  // Update form default value when searchParams changes
  useEffect(() => {
    if (defaultEmail) {
      form.setValue("email", defaultEmail);
    }
  }, [defaultEmail, form]);

  const verifyMutation = useMutation({
    mutationFn: async (data: VerifyFormValues) => {
      const response = await api.post("/auth/verify-email", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Email verified successfully! Please login.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await api.post("/auth/resend-verification", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Verification code resent! Please check your email.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to resend code";
      toast.error(message);
    },
  });

  const onSubmit = (data: VerifyFormValues) => {
    verifyMutation.mutate(data);
  };

  const handleResend = () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Please enter email to resend code");
      return;
    }
    resendMutation.mutate({ email });
  };

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-indigo-600">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-indigo-900">Verify Email</CardTitle>
        <CardDescription className="text-center">
          Enter the verification code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
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
                disabled={verifyMutation.isPending}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="code"
                placeholder="Enter code"
                className="pl-10"
                {...form.register("code")}
                disabled={verifyMutation.isPending}
              />
            </div>
            {form.formState.errors.code && (
              <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
            )}
          </div>
          <Button className="w-full" type="submit" isLoading={verifyMutation.isPending}>
            Verify Email
          </Button>
          <div className="flex justify-center mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={resendMutation.isPending}
              className="text-sm text-indigo-600 hover:underline"
            >
              {resendMutation.isPending ? "Sending..." : "Resend Verification Code"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-gray-500">
          Already verified?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
