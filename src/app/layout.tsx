import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-provider";
import { ThemeProvider } from "@/lib/theme-provider";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import packageJson from "../../package.json";

export const metadata: Metadata = {
  title: "Human Atlas — Explore the Journey of Humanity",
  description:
    "History is not a single timeline. It is a network of people, places, works, ideas and events unfolding at the same time.",
};

// Bumped by hand whenever a data-expansion or feature session wraps up;
// keep in sync with the "データ現状" date tracked alongside the project.
const DATA_AS_OF = "2026-07-23";

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
            <Footer version={packageJson.version} dataAsOf={DATA_AS_OF} />
            <MobileNav />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
