import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import ScrollToTop from "@/components/layout/ScrollToTop";
import ScrollRestoration from "@/components/layout/ScrollRestoration";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "캠퍼스리스트 - 캠퍼스의 모든 것",
  description: "대학 캠퍼스를 중심으로 한 한국형 크레이그리스트. 중고거래, 주거, 일자리, 커뮤니티까지.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Suspense>
                <Header />
              </Suspense>
              <main className="mx-auto min-h-screen max-w-5xl pb-16 md:pb-0">
                {children}
              </main>
              <Suspense>
                <BottomNav />
              </Suspense>
              <ScrollRestoration />
              <ScrollToTop />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
