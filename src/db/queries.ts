import { eq, and, gte, lte, like } from "drizzle-orm";
import { db } from "./client";
import {
  people,
  places,
  works,
  events,
  movements,
  locationPeriods,
  workCreators,
  eventPlaces,
  eventRelatedWorks,
  movementPeople,
  movementWorks,
} from "./schema";
import type { Category } from "./schema";

export type YearCategoryCard = {
  kind: "work" | "event";
  slug: string;
  category: Category;
  title: string;
  titleJa: string | null;
  personName: string | null;
  placeName: string | null;
  placeNameJa: string | null;
  context: string | null;
  contextJa: string | null;
  confidence: string;
};

/**
 * Everything dated to a given year, for the Timeline view (spec §11).
 * A year "matches" a work/event when it falls inside its date range,
 * or is its only known date.
 */
export async function getYearCards(year: number): Promise<YearCategoryCard[]> {
  const yearStr = String(year);
  const yearStart = `${yearStr}-01-01`;
  const yearEnd = `${yearStr}-12-31`;

  const worksInYear = await db
    .select()
    .from(works)
    .where(
      and(
        lte(works.creationStartDate, yearEnd),
        gte(
          // when there's no end date, treat the start date as the end too
          works.creationEndDate,
          yearStart,
        ),
      ),
    );

  // works with only a start date (no range) — matched separately since
  // the AND above requires both columns to be non-null
  const singleDateWorks = await db
    .select()
    .from(works)
    .where(like(works.creationStartDate, `${yearStr}%`));

  const allWorks = dedupeById([...worksInYear, ...singleDateWorks]);

  const eventsInYear = await db
    .select()
    .from(events)
    .where(like(events.startDate, `${yearStr}%`));

  const workCards: YearCategoryCard[] = await Promise.all(
    allWorks.map(async (w) => {
      const creator = await getWorkCreatorName(w.id);
      const place = w.creationPlaceId
        ? await getPlaceName(w.creationPlaceId)
        : null;
      return {
        kind: "work" as const,
        slug: w.slug,
        category: w.category as Category,
        title: w.title,
        titleJa: w.titleJa,
        personName: creator,
        placeName: place?.name ?? null,
        placeNameJa: place?.nameJa ?? null,
        context: w.description,
        contextJa: w.descriptionJa,
        confidence: w.confidence,
      };
    }),
  );

  const eventCards: YearCategoryCard[] = await Promise.all(
    eventsInYear.map(async (e) => {
      const place = await getFirstEventPlaceName(e.id);
      return {
        kind: "event" as const,
        slug: e.slug,
        category: e.category as Category,
        title: e.title,
        titleJa: e.titleJa,
        personName: null,
        placeName: place?.name ?? null,
        placeNameJa: place?.nameJa ?? null,
        context: e.description,
        contextJa: e.descriptionJa,
        confidence: e.confidence,
      };
    }),
  );

  return [...workCards, ...eventCards].sort(
    (a, b) => (b.confidence === "verified" ? 1 : 0) - (a.confidence === "verified" ? 1 : 0),
  );
}

/** Ages of every known person alive in the given year (spec §14). */
export async function getAgeComparison(year: number) {
  const all = await db.select().from(people);
  return all
    .filter((p) => p.birthDate)
    .map((p) => {
      const birthYear = Number(p.birthDate!.slice(0, 4));
      const deathYear = p.deathDate ? Number(p.deathDate.slice(0, 4)) : null;
      return { ...p, age: year - birthYear, deathYear, birthYear };
    })
    .filter((p) => p.age >= 0 && (p.deathYear === null || year <= p.deathYear))
    .sort((a, b) => b.age - a.age);
}

export async function getPersonBySlug(slug: string) {
  const [person] = await db.select().from(people).where(eq(people.slug, slug));
  if (!person) return null;

  const journey = await db
    .select({
      startDate: locationPeriods.startDate,
      endDate: locationPeriods.endDate,
      confidence: locationPeriods.confidence,
      placeName: places.name,
      placeNameJa: places.nameJa,
      placeSlug: places.slug,
    })
    .from(locationPeriods)
    .innerJoin(places, eq(places.id, locationPeriods.placeId))
    .where(eq(locationPeriods.personId, person.id))
    .orderBy(locationPeriods.startDate);

  const createdWorks = await db
    .select({ slug: works.slug, title: works.title, titleJa: works.titleJa })
    .from(workCreators)
    .innerJoin(works, eq(works.id, workCreators.workId))
    .where(eq(workCreators.personId, person.id));

  return { person, journey, works: createdWorks };
}

export async function getWorkBySlug(slug: string) {
  const [work] = await db.select().from(works).where(eq(works.slug, slug));
  if (!work) return null;

  const creator = await getWorkCreatorName(work.id);
  const creationPlace = work.creationPlaceId
    ? await getPlaceName(work.creationPlaceId)
    : null;

  return { work, creator, creationPlace };
}

export async function getPlaceBySlug(slug: string) {
  const [place] = await db.select().from(places).where(eq(places.slug, slug));
  if (!place) return null;

  const worksHere = await db
    .select({ slug: works.slug, title: works.title, titleJa: works.titleJa })
    .from(works)
    .where(eq(works.creationPlaceId, place.id));

  const eventsHere = await db
    .select({ slug: events.slug, title: events.title, titleJa: events.titleJa })
    .from(eventPlaces)
    .innerJoin(events, eq(events.id, eventPlaces.eventId))
    .where(eq(eventPlaces.placeId, place.id));

  const residents = await db
    .select({
      name: people.name,
      nameJa: people.nameJa,
      slug: people.slug,
      startDate: locationPeriods.startDate,
      endDate: locationPeriods.endDate,
    })
    .from(locationPeriods)
    .innerJoin(people, eq(people.id, locationPeriods.personId))
    .where(eq(locationPeriods.placeId, place.id));

  return { place, worksHere, eventsHere, residents };
}

export async function getEventBySlug(slug: string) {
  const [event] = await db.select().from(events).where(eq(events.slug, slug));
  if (!event) return null;

  const place = await getFirstEventPlaceName(event.id);

  const relatedWorks = await db
    .select({ slug: works.slug, title: works.title, titleJa: works.titleJa })
    .from(eventRelatedWorks)
    .innerJoin(works, eq(works.id, eventRelatedWorks.workId))
    .where(eq(eventRelatedWorks.eventId, event.id));

  return { event, place, relatedWorks };
}

export async function getMovementBySlug(slug: string) {
  const [movement] = await db
    .select()
    .from(movements)
    .where(eq(movements.slug, slug));
  if (!movement) return null;

  const membersRows = await db
    .select({ name: people.name, nameJa: people.nameJa, slug: people.slug })
    .from(movementPeople)
    .innerJoin(people, eq(people.id, movementPeople.personId))
    .where(eq(movementPeople.movementId, movement.id));

  const worksRows = await db
    .select({ slug: works.slug, title: works.title, titleJa: works.titleJa })
    .from(movementWorks)
    .innerJoin(works, eq(works.id, movementWorks.workId))
    .where(eq(movementWorks.movementId, movement.id));

  return { movement, members: membersRows, works: worksRows };
}

// --- small helpers -----------------------------------------------------

async function getWorkCreatorName(workId: string) {
  const [row] = await db
    .select({ name: people.name })
    .from(workCreators)
    .innerJoin(people, eq(people.id, workCreators.personId))
    .where(eq(workCreators.workId, workId));
  return row?.name ?? null;
}

async function getPlaceName(placeId: string) {
  const [row] = await db
    .select({ name: places.name, nameJa: places.nameJa })
    .from(places)
    .where(eq(places.id, placeId));
  return row ?? null;
}

async function getFirstEventPlaceName(eventId: string) {
  const [row] = await db
    .select({ name: places.name, nameJa: places.nameJa })
    .from(eventPlaces)
    .innerJoin(places, eq(places.id, eventPlaces.placeId))
    .where(eq(eventPlaces.eventId, eventId));
  return row ?? null;
}

function dedupeById<T extends { id: string }>(rows: T[]): T[] {
  const seen = new Map<string, T>();
  for (const row of rows) seen.set(row.id, row);
  return [...seen.values()];
}
