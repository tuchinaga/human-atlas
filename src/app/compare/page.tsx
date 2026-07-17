import { ScaffoldView } from "@/components/ScaffoldView";

export default function ComparePage() {
  return (
    <ScaffoldView
      eyebrow="Compare"
      title="Van Gogh and Hokusai"
      description="Two or more entities, aligned side by side across lifespan, active years, geography, major works, age at key moments and legacy — as aligned timelines and images, deliberately not a spreadsheet."
      route="/compare?a=vincent-van-gogh&b=katsushika-hokusai"
      notes={[
        "Works for people, places, eras, or any mix — e.g. Paris vs. Vienna, or 1789 vs. 1868.",
        "Each dimension renders as its own quiet block rather than one dense table.",
      ]}
    />
  );
}
