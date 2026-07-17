import { ScaffoldView } from "@/components/ScaffoldView";

export default function SavedPage() {
  return (
    <ScaffoldView
      eyebrow="Saved"
      title="Saved years, people, works and places"
      description="Bookmarked entities for quick return. The MVP scope keeps this in local storage — no accounts, no sync — deferring real persistence to a later release."
      route="/saved"
      notes={[
        "Reachable from the mobile bottom navigation and from any Save action in a card or detail view.",
        "User accounts are explicitly out of MVP scope (section 27).",
      ]}
    />
  );
}
