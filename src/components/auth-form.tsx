"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const REGIONS = [
  { value: "US", label: "🇺🇸 United States", currency: "USD" },
  { value: "INDONESIA", label: "🇮🇩 Indonesia", currency: "IDR" },
  { value: "SINGAPORE", label: "🇸🇬 Singapore", currency: "SGD" },
  { value: "EUROPE", label: "🇪🇺 Europe", currency: "EUR" },
  { value: "AUSTRALIA", label: "🇦🇺 Australia", currency: "AUD" },
];

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("US");
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (!result.success) {
          toast.error(result.error || "Login failed");
        } else {
          toast.success("Welcome back!");
        }
      } else {
        const selectedRegion = REGIONS.find(r => r.value === region);
        const result = await register(email, password, name, region, selectedRegion?.currency || "USD");
        if (!result.success) {
          toast.error(result.error || "Registration failed");
        } else {
          toast.success("Account created successfully!");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-design-id="auth-container" className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-emerald-900/20 via-background to-teal-900/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
      </div>
      
      <Card data-design-id="auth-card" className="w-full max-w-md relative z-10 shadow-2xl border-border/50 backdrop-blur-sm">
        <CardHeader data-design-id="auth-header" className="space-y-1 text-center">
          <div data-design-id="auth-logo" className="mx-auto mb-4 w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <span className="text-3xl">💰</span>
          </div>
          <CardTitle data-design-id="auth-title" className="text-2xl font-bold tracking-tight">
            {isLogin ? "Welcome back" : "Create account"}
          </CardTitle>
          <CardDescription data-design-id="auth-description">
            {isLogin
              ? "Enter your credentials to access your expense journal"
              : "Start tracking your expenses today"}
          </CardDescription>
        </CardHeader>
        <CardContent data-design-id="auth-content">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div data-design-id="auth-name-field" className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div data-design-id="auth-region-field" className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This determines which expense categories you'll see
                  </p>
                </div>
              </>
            )}
            <div data-design-id="auth-email-field" className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div data-design-id="auth-password-field" className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11"
              />
            </div>
            <Button
              data-design-id="auth-submit-btn"
              type="submit"
              className="w-full h-11 gradient-primary text-white font-medium shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>
          <div data-design-id="auth-toggle" className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}