"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import type { NetworkNode, NetworkEdge } from "@/db/queries";

const SIZE = 640;
const CENTER = SIZE / 2;
const RADIUS = 240;

function layoutNodes(nodes: NetworkNode[]) {
  const positions = new Map<string, { x: number; y: number }>();
  nodes.forEach((node, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
    positions.set(node.id, {
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    });
  });
  return positions;
}

export function NetworkView({ nodes, edges }: { nodes: NetworkNode[]; edges: NetworkEdge[] }) {
  const { locale } = useLanguage();
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const positions = useMemo(() => layoutNodes(nodes), [nodes]);
  const connectedIds = useMemo(() => {
    if (!hoveredId) return null;
    const ids = new Set<string>([hoveredId]);
    for (const e of edges) {
      if (e.sourceId === hoveredId) ids.add(e.targetId);
      if (e.targetId === hoveredId) ids.add(e.sourceId);
    }
    return ids;
  }, [hoveredId, edges]);

  return (
    <PageShell>
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">Network</p>
      <h1 className="font-display mt-3 text-4xl leading-[1.1] md:text-5xl">
        {locale === "ja" ? "関係性のネットワーク" : "Network of relationships"}
      </h1>
      <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-fg-soft">
        {locale === "ja"
          ? "実線は明確に記録された関係、破線は同じムーブメントへの所属など間接的なつながりを示します。人物にカーソルを合わせると、つながりが強調されます。"
          : "Solid lines are documented relationships; dashed lines are indirect connections such as shared movement membership. Hover a person to highlight their connections."}
      </p>

      <div className="mx-auto mt-8 max-w-2xl">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Relationship network">
          {edges.map((edge, i) => {
            const a = positions.get(edge.sourceId);
            const b = positions.get(edge.targetId);
            if (!a || !b) return null;
            const dimmed =
              connectedIds && !(connectedIds.has(edge.sourceId) && connectedIds.has(edge.targetId));
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--color-border)"
                strokeWidth={edge.kind === "relationship" ? 1.2 : 0.8}
                strokeDasharray={edge.kind === "movement" || edge.confidence !== "verified" ? "3 3" : undefined}
                opacity={dimmed ? 0.15 : 0.7}
              >
                <title>{locale === "ja" ? edge.labelJa : edge.label}</title>
              </line>
            );
          })}

          {nodes.map((node) => {
            const pos = positions.get(node.id);
            if (!pos) return null;
            const dimmed = connectedIds && !connectedIds.has(node.id);
            const label = (locale === "ja" && node.nameJa) || node.name;
            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(node.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() => router.push(`/people/${node.slug}`)}
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={label}
                opacity={dimmed ? 0.35 : 1}
              >
                <circle r={7} fill="var(--color-accent)" stroke="var(--color-bg)" strokeWidth={2} />
                <text
                  x={pos.x > CENTER ? 12 : -12}
                  y={4}
                  textAnchor={pos.x > CENTER ? "start" : "end"}
                  fill="var(--color-fg)"
                  fontSize={13}
                  className="select-none"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </PageShell>
  );
}
