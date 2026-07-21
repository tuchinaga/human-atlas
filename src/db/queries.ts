import { eq, and, gte, lte, like, ilike, or } from "drizzle-orm";
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
  imageAssets,
  relationships,
  journeys,
  journeySteps,
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
  country: string | null;
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
        country: place?.country ?? null,
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
        country: place?.country ?? null,
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

/**
 * "Meanwhile" (spec §12): given a year, everything else dated to that
 * year, excluding the entity currently being viewed. Just getYearCards
 * with the current item filtered out and capped to a browsable count.
 */
export async function getMeanwhile(
  year: number,
  exclude: { kind: "work" | "event"; slug: string },
  limit = 6,
): Promise<YearCategoryCard[]> {
  const all = await getYearCards(year);
  return all
    .filter((c) => !(c.kind === exclude.kind && c.slug === exclude.slug))
    .slice(0, limit);
}

export async function getPersonBySlug(slug: string) {
  const [person] = await db.select().from(people).where(eq(people.slug, slug));
  if (!person) return null;

  const journey = await db
    .select({
      startDate: locationPeriods.startDate,
      endDate: locationPeriods.endDate,
      reason: locationPeriods.reason,
      reasonJa: locationPeriods.reasonJa,
      confidence: locationPeriods.confidence,
      placeName: places.name,
      placeNameJa: places.nameJa,
      placeSlug: places.slug,
      latitude: places.latitude,
      longitude: places.longitude,
    })
    .from(locationPeriods)
    .innerJoin(places, eq(places.id, locationPeriods.placeId))
    .where(eq(locationPeriods.personId, person.id))
    .orderBy(locationPeriods.startDate);

  const createdWorksRaw = await db
    .select({
      id: works.id,
      slug: works.slug,
      title: works.title,
      titleJa: works.titleJa,
      creationStartDate: works.creationStartDate,
      workType: works.workType,
    })
    .from(workCreators)
    .innerJoin(works, eq(works.id, workCreators.workId))
    .where(eq(workCreators.personId, person.id));

  const createdWorks = await Promise.all(
    createdWorksRaw.map(async (w) => ({
      ...w,
      image: await getImageForEntity("work", w.id),
    })),
  );

  const memberMovements = await db
    .select({ slug: movements.slug, name: movements.name, nameJa: movements.nameJa })
    .from(movementPeople)
    .innerJoin(movements, eq(movements.id, movementPeople.movementId))
    .where(eq(movementPeople.personId, person.id));

  const image = await getImageForEntity("person", person.id);
  const contemporaries = await getContemporaries(person.id, person.birthDate, person.deathDate);

  const currentLocation = journey.length > 0 ? journey[journey.length - 1] : null;

  return {
    person,
    journey,
    works: createdWorks,
    image,
    movements: memberMovements,
    contemporaries,
    currentLocation,
  };
}

/**
 * People whose lifespans overlap this person's (spec's "Contemporaries").
 * Small dataset, so it's simplest to filter in application code — same
 * approach as getAgeComparison.
 */
async function getContemporaries(
  excludeId: string,
  birthDate: string | null,
  deathDate: string | null,
  limit = 5,
) {
  if (!birthDate) return [];
  const birthYear = Number(birthDate.slice(0, 4));
  const deathYear = deathDate ? Number(deathDate.slice(0, 4)) : birthYear + 90;

  const all = await db.select().from(people);
  return all
    .filter((p) => p.id !== excludeId && p.birthDate)
    .map((p) => {
      const pBirth = Number(p.birthDate!.slice(0, 4));
      const pDeath = p.deathDate ? Number(p.deathDate.slice(0, 4)) : pBirth + 90;
      return { ...p, pBirth, pDeath };
    })
    .filter((p) => p.pBirth <= deathYear && p.pDeath >= birthYear)
    .sort((a, b) => Math.abs(a.pBirth - birthYear) - Math.abs(b.pBirth - birthYear))
    .slice(0, limit);
}

export async function getWorkBySlug(slug: string) {
  const [work] = await db.select().from(works).where(eq(works.slug, slug));
  if (!work) return null;

  const creator = await getWorkCreator(work.id);
  const creationPlace = work.creationPlaceId
    ? await getPlaceName(work.creationPlaceId)
    : null;
  const image = await getImageForEntity("work", work.id);

  const [movement] = await db
    .select({ slug: movements.slug, name: movements.name, nameJa: movements.nameJa })
    .from(movementWorks)
    .innerJoin(movements, eq(movements.id, movementWorks.movementId))
    .where(eq(movementWorks.workId, work.id));

  return { work, creator, creationPlace, image, movement: movement ?? null };
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

export async function getMapPlaces() {
  const rows = await db
    .select({
      slug: places.slug,
      name: places.name,
      nameJa: places.nameJa,
      country: places.country,
      latitude: places.latitude,
      longitude: places.longitude,
    })
    .from(places);
  return rows.filter(
    (r): r is typeof r & { latitude: number; longitude: number } =>
      r.latitude !== null && r.longitude !== null,
  );
}

export type SearchResults = {
  year: number | null;
  people: { slug: string; name: string; nameJa: string | null }[];
  works: { slug: string; title: string; titleJa: string | null }[];
  places: { slug: string; name: string; nameJa: string | null }[];
  events: { slug: string; title: string; titleJa: string | null }[];
  movements: { slug: string; name: string; nameJa: string | null }[];
};

/**
 * Universal search (spec §9, §23): a query can be a year, a person, a
 * work, a place, an event, or a movement, matched against both the
 * English and Japanese name/title fields. The dataset is small enough
 * that simple ILIKE matching covers partial matches and cross-language
 * lookups (e.g. "北斎" and "Hokusai" both match Katsushika Hokusai)
 * without needing a dedicated search index.
 */
export async function searchAll(rawQuery: string): Promise<SearchResults> {
  const query = rawQuery.trim();
  const pattern = `%${query}%`;
  const yearMatch = /^\d{1,4}$/.test(query) ? Number(query) : null;

  const [peopleRows, workRows, placeRows, eventRows, movementRows] = await Promise.all([
    db
      .select({ slug: people.slug, name: people.name, nameJa: people.nameJa })
      .from(people)
      .where(or(ilike(people.name, pattern), ilike(people.nameJa, pattern)))
      .limit(10),
    db
      .select({ slug: works.slug, title: works.title, titleJa: works.titleJa })
      .from(works)
      .where(or(ilike(works.title, pattern), ilike(works.titleJa, pattern)))
      .limit(10),
    db
      .select({ slug: places.slug, name: places.name, nameJa: places.nameJa })
      .from(places)
      .where(or(ilike(places.name, pattern), ilike(places.nameJa, pattern)))
      .limit(10),
    db
      .select({ slug: events.slug, title: events.title, titleJa: events.titleJa })
      .from(events)
      .where(or(ilike(events.title, pattern), ilike(events.titleJa, pattern)))
      .limit(10),
    db
      .select({ slug: movements.slug, name: movements.name, nameJa: movements.nameJa })
      .from(movements)
      .where(or(ilike(movements.name, pattern), ilike(movements.nameJa, pattern)))
      .limit(10),
  ]);

  return {
    year: yearMatch,
    people: peopleRows,
    works: workRows,
    places: placeRows,
    events: eventRows,
    movements: movementRows,
  };
}

export type NetworkNode = { id: string; slug: string; name: string; nameJa: string | null };
export type NetworkEdge = {
  sourceId: string;
  targetId: string;
  kind: "relationship" | "movement";
  label: string;
  labelJa: string;
  confidence: string;
};

/**
 * Data for the Network view (spec §16): people as nodes, with two kinds
 * of edges — documented Relationship records, and a lighter "same
 * movement" edge for people who share a Movement. Line style (dashed
 * vs solid) is left to the renderer, keyed off confidence, so a
 * documented relationship never looks the same as an inferred one.
 */
export async function getNetworkData(): Promise<{ nodes: NetworkNode[]; edges: NetworkEdge[] }> {
  const nodes = await db
    .select({ id: people.id, slug: people.slug, name: people.name, nameJa: people.nameJa })
    .from(people);

  const relRows = await db
    .select({
      subjectId: relationships.subjectId,
      objectId: relationships.objectId,
      relationshipType: relationships.relationshipType,
      confidence: relationships.confidence,
    })
    .from(relationships);

  const movementRows = await db
    .select({
      personId: movementPeople.personId,
      movementId: movementPeople.movementId,
      movementName: movements.name,
      movementNameJa: movements.nameJa,
    })
    .from(movementPeople)
    .innerJoin(movements, eq(movements.id, movementPeople.movementId));

  const edges: NetworkEdge[] = relRows.map((r) => ({
    sourceId: r.subjectId,
    targetId: r.objectId,
    kind: "relationship",
    label: r.relationshipType,
    labelJa: r.relationshipType,
    confidence: r.confidence,
  }));

  // pair up co-members of the same movement
  const byMovement = new Map<string, { personId: string; name: string; nameJa: string | null }[]>();
  for (const row of movementRows) {
    const list = byMovement.get(row.movementId) ?? [];
    list.push({ personId: row.personId, name: row.movementName, nameJa: row.movementNameJa });
    byMovement.set(row.movementId, list);
  }
  for (const members of byMovement.values()) {
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        edges.push({
          sourceId: members[i].personId,
          targetId: members[j].personId,
          kind: "movement",
          label: `same movement: ${members[i].name}`,
          labelJa: `同じムーブメント: ${members[i].nameJa ?? members[i].name}`,
          confidence: "verified",
        });
      }
    }
  }

  return { nodes, edges };
}

export async function getAllPeopleForPicker() {
  return db
    .select({ slug: people.slug, name: people.name, nameJa: people.nameJa })
    .from(people)
    .orderBy(people.name);
}

async function getPersonCompareData(slug: string) {
  const [person] = await db.select().from(people).where(eq(people.slug, slug));
  if (!person) return null;

  const workRows = await db
    .select({ slug: works.slug, title: works.title, titleJa: works.titleJa, creationStartDate: works.creationStartDate })
    .from(workCreators)
    .innerJoin(works, eq(works.id, workCreators.workId))
    .where(eq(workCreators.personId, person.id));

  const movementRows = await db
    .select({ slug: movements.slug, name: movements.name, nameJa: movements.nameJa })
    .from(movementPeople)
    .innerJoin(movements, eq(movements.id, movementPeople.movementId))
    .where(eq(movementPeople.personId, person.id));

  const journeyRows = await db
    .select({ placeName: places.name, placeNameJa: places.nameJa })
    .from(locationPeriods)
    .innerJoin(places, eq(places.id, locationPeriods.placeId))
    .where(eq(locationPeriods.personId, person.id))
    .orderBy(locationPeriods.startDate);

  const image = await getImageForEntity("person", person.id);

  return {
    person,
    works: workRows,
    movements: movementRows,
    journey: journeyRows,
    image,
  };
}

export async function getCompareData(slugA: string, slugB: string) {
  const [a, b] = await Promise.all([
    getPersonCompareData(slugA),
    getPersonCompareData(slugB),
  ]);
  return { a, b };
}

export type JourneyStepResolved = {
  type: string;
  slug: string;
  href: string;
  title: string;
  titleJa: string | null;
  caption: string | null;
  captionJa: string | null;
};

/**
 * Editorial Journeys (spec §18) are sequences of references into
 * existing entities — never a hard-coded page. Each step just stores
 * {stepType, stepSlug}; this resolves that into a display title by
 * looking the entity up in its own table, so the journey never drifts
 * out of sync with the underlying record.
 */
export type FeaturedJourneySummary = {
  slug: string;
  title: string;
  titleJa: string | null;
  description: string | null;
  descriptionJa: string | null;
  image: Awaited<ReturnType<typeof getImageForEntity>>;
};

/**
 * Picks one journey at random for the homepage teaser (spec §18 lists
 * several journeys; the homepage rotates rather than always showing
 * the same one). Uses the first work-type step with a cleared image
 * as the card image, falling back to the rights-pending placeholder.
 */
export async function getRandomFeaturedJourney(): Promise<FeaturedJourneySummary | null> {
  const all = await db.select().from(journeys);
  if (all.length === 0) return null;
  const journey = all[Math.floor(Math.random() * all.length)];

  const steps = await db
    .select()
    .from(journeySteps)
    .where(eq(journeySteps.journeyId, journey.id))
    .orderBy(journeySteps.position);

  let image: Awaited<ReturnType<typeof getImageForEntity>> = null;
  for (const step of steps) {
    if (step.stepType !== "work" && step.stepType !== "person") continue;
    let entityId: string | null = null;
    if (step.stepType === "work") {
      const [work] = await db.select().from(works).where(eq(works.slug, step.stepSlug));
      entityId = work?.id ?? null;
    } else {
      const [person] = await db.select().from(people).where(eq(people.slug, step.stepSlug));
      entityId = person?.id ?? null;
    }
    if (!entityId) continue;
    const entityImage = await getImageForEntity(step.stepType, entityId);
    if (entityImage) {
      image = entityImage;
      break;
    }
  }

  return {
    slug: journey.slug,
    title: journey.title,
    titleJa: journey.titleJa,
    description: journey.description,
    descriptionJa: journey.descriptionJa,
    image,
  };
}

export async function getJourneyBySlug(slug: string) {
  const [journey] = await db.select().from(journeys).where(eq(journeys.slug, slug));
  if (!journey) return null;

  const steps = await db
    .select()
    .from(journeySteps)
    .where(eq(journeySteps.journeyId, journey.id))
    .orderBy(journeySteps.position);

  const resolved: JourneyStepResolved[] = [];
  for (const step of steps) {
    if (step.stepType === "year") {
      resolved.push({
        type: "year",
        slug: step.stepSlug,
        href: `/year/${step.stepSlug}`,
        title: step.stepSlug,
        titleJa: step.stepSlug,
        caption: step.caption,
        captionJa: step.captionJa,
      });
      continue;
    }

    const tableMap = {
      person: { table: people, nameField: people.name, nameJaField: people.nameJa, path: "people" },
      work: { table: works, nameField: works.title, nameJaField: works.titleJa, path: "works" },
      place: { table: places, nameField: places.name, nameJaField: places.nameJa, path: "places" },
      event: { table: events, nameField: events.title, nameJaField: events.titleJa, path: "events" },
      movement: { table: movements, nameField: movements.name, nameJaField: movements.nameJa, path: "movements" },
    } as const;

    const config = tableMap[step.stepType as keyof typeof tableMap];
    if (!config) continue;

    const [entity] = await db
      .select({ name: config.nameField, nameJa: config.nameJaField })
      .from(config.table as typeof people)
      .where(eq((config.table as typeof people).slug, step.stepSlug));

    if (!entity) continue;

    resolved.push({
      type: step.stepType,
      slug: step.stepSlug,
      href: `/${config.path}/${step.stepSlug}`,
      title: entity.name,
      titleJa: entity.nameJa,
      caption: step.caption,
      captionJa: step.captionJa,
    });
  }

  return { journey, steps: resolved };
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

export async function getImageForEntity(entityType: string, entityId: string) {
  const [row] = await db
    .select()
    .from(imageAssets)
    .where(
      and(eq(imageAssets.entityType, entityType), eq(imageAssets.entityId, entityId)),
    );
  if (!row || !row.imageUrl) return null;
  return { ...row, imageUrl: row.imageUrl };
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

async function getWorkCreator(workId: string) {
  const [row] = await db
    .select({ name: people.name, nameJa: people.nameJa, slug: people.slug })
    .from(workCreators)
    .innerJoin(people, eq(people.id, workCreators.personId))
    .where(eq(workCreators.workId, workId));
  return row ?? null;
}

async function getPlaceName(placeId: string) {
  const [row] = await db
    .select({
      name: places.name,
      nameJa: places.nameJa,
      country: places.country,
      slug: places.slug,
    })
    .from(places)
    .where(eq(places.id, placeId));
  return row ?? null;
}

async function getFirstEventPlaceName(eventId: string) {
  const [row] = await db
    .select({
      name: places.name,
      nameJa: places.nameJa,
      country: places.country,
      slug: places.slug,
    })
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
