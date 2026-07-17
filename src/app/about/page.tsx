import { ScaffoldView } from "@/components/ScaffoldView";

export default function AboutPage() {
  return (
    <ScaffoldView
      eyebrow="About"
      title="One moment. One view. Infinite depth."
      description="Human Atlas is a simple interface placed over a rich historical knowledge graph. It should not ask anyone to study history — it invites them to enter a year, meet the people who lived in it, and see how the world was connected."
      route="/about"
      notes={[
        "Explains the project's editorial standards, sourcing policy and confidence-labeling system.",
        "Links out to /sources and /rights.",
      ]}
    />
  );
}
