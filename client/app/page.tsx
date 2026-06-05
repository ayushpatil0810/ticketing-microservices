import { getCurrentUserSSR } from "@/lib/api-server";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

// Server Component — renders with correct auth state immediately, no loading flash
export default async function HomePage() {
  const user = await getCurrentUserSSR();

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center p-6">
      {user ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <Check className="h-8 w-8 text-green-500" />
          <h1 className="text-2xl font-semibold">Welcome back, {user.username}.</h1>
          <p className="text-muted-foreground text-sm">Signed in as {user.email}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-semibold">You are not signed in.</h1>
          <p className="text-muted-foreground text-sm">Sign in to access your account.</p>
          <Button asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
      )}
    </div>
  );
}