import { cookies } from "next/headers";
import type { User, ApiResponse } from "./api";

/**
 * Server-side getCurrentUser.
 * Reads the cookie header from the incoming request and forwards it to
 * the auth service via the internal K8s service name so SSR works.
 */
export async function getCurrentUserSSR(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch("http://auth-srv:3000/api/auth/currentuser", {
      headers: {
        Cookie: cookieHeader,
      },
      // Don't cache — always fresh per-request
      cache: "no-store",
    });

    if (!res.ok) return null;

    const body: ApiResponse<User> = await res.json();
    return body.data ?? null;
  } catch {
    return null;
  }
}
