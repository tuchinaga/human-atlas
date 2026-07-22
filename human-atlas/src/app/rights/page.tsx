import { ScaffoldView } from "@/components/ScaffoldView";

export default function RightsPage() {
  return (
    <ScaffoldView
      eyebrow="Rights"
      title="Image rights and attribution"
      description="Human Atlas only displays an image when its use conditions are known — Public Domain, CC0, CC BY, CC BY-SA, or an institution API with stated reuse rights. Unclear or copyrighted images are never hosted, cached or approximated."
      route="/rights"
      notes={[
        "Every image carries source, creator, license, attribution text and a last-verification date.",
        "Unclear status renders the same neutral placeholder used across the app — see the homepage's featured journey card.",
      ]}
    />
  );
}
