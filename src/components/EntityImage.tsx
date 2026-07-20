"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type ImageAssetData = {
  imageUrl: string;
  attribution: string | null;
  sourceName: string | null;
  sourceRecordUrl: string | null;
  license: string | null;
  publicDomain: boolean;
};

/**
 * The single rule this component enforces (spec §19): never show an
 * image whose rights are unknown. If `image` is null — no Image Asset
 * record, or one that failed rights review — render the neutral
 * placeholder instead of guessing, faking, or generating a substitute.
 *
 * Images are never cropped: the main preview always uses object-contain
 * (never object-cover), so the full composition is always visible.
 * Pass `hero` for a large, naturally-proportioned display (Work detail
 * pages) instead of a fixed-aspect box (portraits, teaser cards).
 */
export function EntityImage({
  image,
  alt,
  aspect = "aspect-[4/3]",
  className = "",
  zoomable = false,
  hero = false,
}: {
  image: ImageAssetData | null;
  alt: string;
  aspect?: string;
  className?: string;
  zoomable?: boolean;
  hero?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!image) {
    return (
      <div className={`relative ${aspect} ${className}`}>
        <RightsPendingPlaceholder />
      </div>
    );
  }

  const imageBox = hero ? (
    <div className="flex justify-center overflow-hidden rounded-sm border border-border bg-bg-raised p-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- external, rights-cleared source; not part of the Next.js image pipeline */}
      <img
        src={image.imageUrl}
        alt={alt}
        className="max-h-[70vh] w-auto max-w-full object-contain"
        loading="lazy"
      />
    </div>
  ) : (
    <div className={`relative ${aspect} overflow-hidden rounded-sm border border-border bg-bg-raised`}>
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${image.imageUrl})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );

  return (
    <figure className={className}>
      {zoomable ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full cursor-zoom-in text-left"
          aria-label={`${alt} — enlarge`}
        >
          {imageBox}
        </button>
      ) : (
        imageBox
      )}

      <figcaption className="mt-2 text-[11px] leading-snug text-fg-muted">
        {image.publicDomain ? "Public domain" : image.license ?? "Rights cleared"}
        {image.sourceName && <> · {image.sourceName}</>}
        {image.sourceRecordUrl && (
          <>
            {" "}
            ·{" "}
            <Link
              href={image.sourceRecordUrl}
              className="underline underline-offset-2 hover:text-fg-soft"
              target="_blank"
              rel="noopener noreferrer"
            >
              source
            </Link>
          </>
        )}
      </figcaption>

      {zoomable && open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white/80 transition-colors hover:border-white hover:text-white"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- lightbox view of the same external source */}
          <img
            src={image.imageUrl}
            alt={alt}
            className="max-h-full max-w-full cursor-zoom-out object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </figure>
  );
}

export function RightsPendingPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-sm border border-border bg-[repeating-linear-gradient(135deg,var(--color-border)_0px,var(--color-border)_1px,transparent_1px,transparent_14px)] bg-bg-raised">
      <span className="rounded-full border border-border bg-bg px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-fg-muted">
        Image pending rights review
      </span>
    </div>
  );
}
