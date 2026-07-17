import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-provider";
import { ThemeProvider } from "@/lib/theme-provider";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "Human Atlas — Explore the Journey of Humanity",
  description:
    "History is not a single timeline. It is a network of people, places, works, ideas and events unfolding at the same time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main className="min-h-[calc(100vh-4rem)] pb-16 md:pb-0">
              {children}
            </main>
            <MobileNav />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
