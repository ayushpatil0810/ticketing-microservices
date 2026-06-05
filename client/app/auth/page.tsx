"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

interface FieldErrors {
  fieldErrors?: Record<string, string[]>;
  formErrors?: string[];
}

type Tab = "signin" | "signup";

export default function AuthPage() {
  const { signin, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("signin");

  // Sign In state
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siFieldErrors, setSiFieldErrors] = useState<FieldErrors | null>(null);
  const [siGenericError, setSiGenericError] = useState("");
  const [siLoading, setSiLoading] = useState(false);

  // Sign Up state
  const [suUsername, setSuUsername] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suFieldErrors, setSuFieldErrors] = useState<FieldErrors | null>(null);
  const [suGenericError, setSuGenericError] = useState("");
  const [suLoading, setSuLoading] = useState(false);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setSiFieldErrors(null);
    setSiGenericError("");
    setSuFieldErrors(null);
    setSuGenericError("");
  };

  const extractErrors = (err: unknown): { fieldErrors: FieldErrors | null; generic: string } => {
    if (err && typeof err === "object" && "response" in err) {
      const axiosErr = err as { response?: { data?: { errors?: FieldErrors; message?: string } } };
      const data = axiosErr.response?.data;
      if (data) {
        return {
          fieldErrors: data.errors ?? null,
          generic: data.message ?? "Something went wrong. Please try again.",
        };
      }
    }
    return { fieldErrors: null, generic: "Network error. Please try again." };
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiFieldErrors(null);
    setSiGenericError("");
    setSiLoading(true);
    try {
      await signin(siEmail, siPassword);
      window.location.href = "/";
    } catch (err) {
      const { fieldErrors, generic } = extractErrors(err);
      setSiFieldErrors(fieldErrors);
      setSiGenericError(generic);
    } finally {
      setSiLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuFieldErrors(null);
    setSuGenericError("");
    setSuLoading(true);
    try {
      await signup(suUsername, suEmail, suPassword);
      window.location.href = "/";
    } catch (err) {
      const { fieldErrors, generic } = extractErrors(err);
      setSuFieldErrors(fieldErrors);
      setSuGenericError(generic);
    } finally {
      setSuLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Sign in to your account or create a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Plain tab switcher — no Radix Tabs to avoid hydration/state issues */}
          <div className="grid w-full grid-cols-2 rounded-lg bg-muted p-1 mb-4">
            <button
              type="button"
              onClick={() => switchTab("signin")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                activeTab === "signin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab("signup")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                activeTab === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="si-email">Email</Label>
                <Input
                  id="si-email"
                  type="email"
                  placeholder="you@example.com"
                  value={siEmail}
                  onChange={(e) => setSiEmail(e.target.value)}
                  disabled={siLoading}
                  autoComplete="email"
                />
                {siFieldErrors?.fieldErrors?.email && (
                  <p className="text-sm text-destructive">
                    {siFieldErrors.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="si-password">Password</Label>
                <Input
                  id="si-password"
                  type="password"
                  placeholder="Your password"
                  value={siPassword}
                  onChange={(e) => setSiPassword(e.target.value)}
                  disabled={siLoading}
                  autoComplete="current-password"
                />
                {siFieldErrors?.fieldErrors?.password && (
                  <p className="text-sm text-destructive">
                    {siFieldErrors.fieldErrors.password[0]}
                  </p>
                )}
              </div>

              {siGenericError && (
                <p className="text-sm text-destructive">{siGenericError}</p>
              )}

              <Button type="submit" className="w-full" disabled={siLoading}>
                {siLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="su-username">Username</Label>
                <Input
                  id="su-username"
                  type="text"
                  placeholder="johndoe"
                  value={suUsername}
                  onChange={(e) => setSuUsername(e.target.value)}
                  disabled={suLoading}
                  autoComplete="username"
                />
                {suFieldErrors?.fieldErrors?.username && (
                  <p className="text-sm text-destructive">
                    {suFieldErrors.fieldErrors.username[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="su-email">Email</Label>
                <Input
                  id="su-email"
                  type="email"
                  placeholder="you@example.com"
                  value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                  disabled={suLoading}
                  autoComplete="email"
                />
                {suFieldErrors?.fieldErrors?.email && (
                  <p className="text-sm text-destructive">
                    {suFieldErrors.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="su-password">Password</Label>
                <Input
                  id="su-password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={suPassword}
                  onChange={(e) => setSuPassword(e.target.value)}
                  disabled={suLoading}
                  autoComplete="new-password"
                />
                {suFieldErrors?.fieldErrors?.password && (
                  <p className="text-sm text-destructive">
                    {suFieldErrors.fieldErrors.password[0]}
                  </p>
                )}
              </div>

              {suGenericError && (
                <p className="text-sm text-destructive">{suGenericError}</p>
              )}

              <Button type="submit" className="w-full" disabled={suLoading}>
                {suLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}