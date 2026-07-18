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
 */
export function EntityImage({
  image,
  aspect = "aspect-[4/3]",
  className = "",
}: {
  image: ImageAssetData | null;
  aspect?: string;
  className?: string;
}) {
  if (!image) {
    return (
      <div className={`relative ${aspect} ${className}`}>
        <RightsPendingPlaceholder />
      </div>
    );
  }

  return (
    <figure className={className}>
      <div className={`relative ${aspect} overflow-hidden rounded-sm border border-border bg-bg-raised`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- external, rights-cleared source; not part of the Next.js image pipeline */}
        <img
          src={image.imageUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
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
