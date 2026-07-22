export type TrailStepType = "person" | "work" | "place" | "event" | "movement" | "year";

export type TrailStep = {
  type: TrailStepType;
  slug: string;
  label: string;
};

export const TRAIL_TYPE_PATH: Record<TrailStepType, string> = {
  person: "people",
  work: "works",
  place: "places",
  event: "events",
  movement: "movements",
  year: "year",
};

const MAX_TRAIL_LENGTH = 4;
const STEP_DELIMITER = ">";
const FIELD_DELIMITER = ":";

function encodeStep(step: TrailStep): string {
  return [step.type, step.slug, encodeURIComponent(step.label)].join(FIELD_DELIMITER);
}

function decodeStep(raw: string): TrailStep | null {
  const [type, slug, encodedLabel] = raw.split(FIELD_DELIMITER);
  if (!type || !slug || encodedLabel === undefined) return null;
  try {
    return { type: type as TrailStepType, slug, label: decodeURIComponent(encodedLabel) };
  } catch {
    return null;
  }
}

/** Parse the `?trail=` query value into an ordered list of steps. */
export function parseTrail(raw: string | undefined): TrailStep[] {
  if (!raw) return [];
  return raw
    .split(STEP_DELIMITER)
    .map(decodeStep)
    .filter((s): s is TrailStep => s !== null);
}

function serializeTrail(steps: TrailStep[]): string {
  return steps.map(encodeStep).join(STEP_DELIMITER);
}

/**
 * The trail value to use for links leading *away* from the page currently
 * showing `step` — i.e. append the current entity so the next page knows
 * how the person got there. Capped at MAX_TRAIL_LENGTH so it stays a
 * short "how did I get here" aid, not an infinite history.
 */
export function extendTrail(raw: string | undefined, step: TrailStep): string {
  const steps = parseTrail(raw);
  const next = [...steps, step].slice(-MAX_TRAIL_LENGTH);
  return serializeTrail(next);
}

/** The trail value for the breadcrumb link at position `index` — everything before it. */
export function truncateTrail(steps: TrailStep[], index: number): string {
  return serializeTrail(steps.slice(0, index));
}
