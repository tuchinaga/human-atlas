"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { MeanwhileThread } from "@/components/MeanwhileThread";

export default function NotFound() {
  const { locale } = useLanguage();

  return (
    <PageShell>
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">404</p>
      <h1 className="font-display mt-3 max-w-xl text-4xl leading-[1.1] md:text-5xl">
        {locale === "ja" ? "この年、この場所は見つかりません" : "This year, this place, isn't here"}
      </h1>
      <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-fg-soft">
        {locale === "ja"
          ? "お探しのページは存在しないか、まだ登録されていません。"
          : "The page you're looking for doesn't exist, or hasn't been added yet."}
      </p>

      <MeanwhileThread animated={false} className="mt-10 h-3 w-full max-w-md opacity-60" />

      <Link
        href="/"
        className="mt-10 inline-block text-[13px] text-fg-soft underline underline-offset-2 transition-colors hover:text-fg"
      >
        {locale === "ja" ? "ホームに戻る" : "Back to Human Atlas"}
      </Link>
    </PageShell>
  );
}
