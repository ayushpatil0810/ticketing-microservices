"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentUser, signin as apiSignin, signup as apiSignup, signout as apiSignout, User } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

const refreshUser = async (): Promise<User | null> => {
  try {
    const res = await getCurrentUser();
    return res.data;
  } catch (err: unknown) {
    // Treat 401 as unauthenticated — not an error
    if (err && typeof err === "object" && "response" in err) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 401) return null;
    }
    // Any other error (network, 5xx): treat as unauthenticated to avoid infinite loading
    return null;
  }
};

interface AuthProviderProps {
  children: React.ReactNode;
  /** Optionally seed auth state from SSR to avoid client-side loading flash */
  initialUser?: User | null;
}

export const AuthProvider = ({ children, initialUser }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  // If SSR provided the user (even null explicitly), we already know the state
  const [isLoading, setIsLoading] = useState(initialUser === undefined);

  useEffect(() => {
    // Skip client-side fetch when the layout already seeded user via SSR
    if (initialUser !== undefined) return;

    refreshUser()
      .then((u) => setUser(u))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signin = useCallback(
    async (email: string, password: string) => {
      await apiSignin({ email, password });
      const u = await refreshUser();
      setUser(u);
    },
    []
  );

  const signup = useCallback(
    async (username: string, email: string, password: string) => {
      await apiSignup({ username, email, password });
      const u = await refreshUser();
      setUser(u);
    },
    []
  );

  const signout = useCallback(async () => {
    await apiSignout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signin,
        signup,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};