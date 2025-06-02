// pages/index.tsx (Login Page)
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder logic — replace with real auth logic
    if (email && password) {
      router.push("/dashboard");
    } else {
      alert("Please enter credentials");
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="grid md:grid-cols-2 bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
        {/* Welcome Section */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-gray-800 to-gray-700">
          <h1 className="text-3xl font-bold mb-4">Welcome to JobSwift</h1>
          <p className="text-gray-300 text-sm">
            Automatically apply to relevant jobs based on your profile. Upload your resume, set your preferences, and let us do the heavy lifting.
          </p>
        </div>

        {/* Login Form */}
        <div className="p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <LogIn className="w-6 h-6" /> Login
            </h2>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gray-700 hover:bg-gray-600">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}