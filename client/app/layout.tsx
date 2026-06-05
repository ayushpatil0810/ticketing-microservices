import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Navbar } from "@/components/navbar";
import { getCurrentUserSSR } from "@/lib/api-server";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Server Component — can use async/await and forward cookies to the auth service
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch current user server-side so auth state is available on first render
  const initialUser = await getCurrentUserSSR();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          <AuthProvider initialUser={initialUser}>
            <Navbar />
            <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}