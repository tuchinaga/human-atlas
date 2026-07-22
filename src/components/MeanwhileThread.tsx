import { CATEGORY_COLOR_VAR, CATEGORY_ORDER, type CategoryKey } from "@/lib/categories";

export type ThreadNode = {
  x: number; // 0–100, position along the thread
  category: CategoryKey;
  label: string;
};

const DEFAULT_NODES: ThreadNode[] = [
  { x: 4, category: "art", label: "The Starry Night" },
  { x: 16, category: "architecture", label: "Eiffel Tower opens" },
  { x: 28, category: "society", label: "Meiji Constitution" },
  { x: 40, category: "music", label: "Mahler, Symphony No. 1" },
  { x: 52, category: "literature", label: "Sōseki begins writing" },
  { x: 64, category: "history", label: "Exposition Universelle" },
  { x: 76, category: "science", label: "Discovery of radium" },
  { x: 88, category: "technology", label: "Nintendo Koppai founded" },
  { x: 96, category: "ideas", label: "The Communist Manifesto" },
];

/**
 * The single signature element of Human Atlas: a thin horizontal line
 * standing in for a year, with small dated nodes scattered across it —
 * a literal picture of the product's thesis that history is a network
 * of simultaneous events, not one column of dates. Reused, quieted down,
 * at the top of Year and Meanwhile views.
 */
export function MeanwhileThread({
  nodes = DEFAULT_NODES,
  animated = true,
  className = "",
}: {
  nodes?: ThreadNode[];
  animated?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label="A thread representing simultaneous events across the world"
    >
      <line
        x1="0"
        y1="6"
        x2="100"
        y2="6"
        stroke="var(--color-border)"
        strokeWidth="0.15"
        vectorEffect="non-scaling-stroke"
      />
      {nodes.map((node, i) => (
        <g key={`${node.category}-${node.x}`}>
          <circle
            cx={node.x}
            cy={6}
            r="0.9"
            fill={CATEGORY_COLOR_VAR[node.category]}
            className={animated ? "ha-thread-node" : undefined}
            style={
              animated
                ? { animationDelay: `${i * 120}ms` }
                : undefined
            }
          >
            <title>{node.label}</title>
          </circle>
        </g>
      ))}
      <style>{`
        .ha-thread-node {
          opacity: 0;
          animation: ha-node-in 0.6s ease forwards;
          transform-origin: center;
          transform-box: fill-box;
        }
        @keyframes ha-node-in {
          from { opacity: 0; transform: scale(0.4); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ha-thread-node { animation: none; opacity: 1; }
        }
      `}</style>
    </svg>
  );
}

export { DEFAULT_NODES, CATEGORY_ORDER };
