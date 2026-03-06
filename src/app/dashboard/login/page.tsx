"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Lock, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-maroon-800">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-gray-900">
            Staff Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            MSEUF University Libraries
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 card space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="librarian@mseuf.edu.ph"
            icon={<Mail className="h-4 w-4" />}
            required
          />

          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            icon={<Lock className="h-4 w-4" />}
            required
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
          </Button>

          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
            <p className="font-medium">Demo Credentials:</p>
            <p>Email: admin@mseuf.edu.ph</p>
            <p>Password: admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
