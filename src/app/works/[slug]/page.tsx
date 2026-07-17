import { ScaffoldView } from "@/components/ScaffoldView";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <ScaffoldView
      eyebrow="Work"
      title={title}
      description="Supports paintings, sculpture, photographs, compositions, books, poems, buildings, inventions, films, documents and archaeological objects — one detail template, typed by workType."
      route={`/works/${slug}`}
      notes={[
        "Image renders only when an Image Asset with a known rights status is attached (section 19).",
        "Includes a Meanwhile section positioned at the work's creation date and place.",
        "Interpretation and provenance are never fabricated; uncertain fields carry a confidence label.",
      ]}
    />
  );
}
