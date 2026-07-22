import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Schema notes
 * ------------
 * This mirrors the entity model in the product spec (section 21) with
 * one pragmatic simplification for the MVP: multi-valued simple fields
 * (aliases, occupations, nationalities, historicalNames) and `sources`
 * are stored as JSON text columns rather than fully normalized join
 * tables. Structural relationships that the UI actually queries against
 * — who created what, who was where and when, what happened at a place,
 * who is related to whom — are real foreign keys / join tables.
 *
 * Runs on PostgreSQL, per the spec's recommended stack (section 24).
 * Local dev connects to a local Postgres instance by default — see
 * src/db/client.ts and the README for how to point DATABASE_URL at a
 * hosted database (Neon, Supabase, etc.) for both local dev and
 * production (e.g. on Netlify).
 */

const confidenceValues = [
  "verified",
  "probable",
  "approximate",
  "disputed",
  "unknown",
] as const;
export type Confidence = (typeof confidenceValues)[number];

const categoryValues = [
  "history",
  "society",
  "art",
  "music",
  "literature",
  "science",
  "technology",
  "architecture",
  "ideas",
] as const;
export type Category = (typeof categoryValues)[number];

export const places = pgTable("places", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  wikidataId: text("wikidata_id"),
  name: text("name").notNull(),
  nameJa: text("name_ja"),
  historicalNamesJson: text("historical_names_json"), // JSON string[]
  placeType: text("place_type"),
  country: text("country"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  parentPlaceId: text("parent_place_id"),
  validFrom: text("valid_from"),
  validTo: text("valid_to"),
  sourcesJson: text("sources_json"), // JSON Source[]
});

export const people = pgTable("people", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  wikidataId: text("wikidata_id"),
  name: text("name").notNull(),
  nameJa: text("name_ja"),
  nativeName: text("native_name"),
  aliasesJson: text("aliases_json"), // JSON string[]
  birthDate: text("birth_date"), // ISO or partial, e.g. "1853-03-30"
  birthDateDisplay: text("birth_date_display"), // e.g. "c. 1503"
  deathDate: text("death_date"),
  deathDateDisplay: text("death_date_display"),
  birthPlaceId: text("birth_place_id").references(() => places.id),
  deathPlaceId: text("death_place_id").references(() => places.id),
  nationalitiesJson: text("nationalities_json"), // JSON string[]
  occupationsJson: text("occupations_json"), // JSON string[]
  disciplinesJson: text("disciplines_json"), // JSON string[]
  biography: text("biography"),
  biographyJa: text("biography_ja"),
  portraitImageId: text("portrait_image_id"),
  sourcesJson: text("sources_json"),
});

export const locationPeriods = pgTable("location_periods", {
  id: text("id").primaryKey(),
  personId: text("person_id")
    .notNull()
    .references(() => people.id),
  placeId: text("place_id")
    .notNull()
    .references(() => places.id),
  startDate: text("start_date"),
  endDate: text("end_date"),
  reason: text("reason"),
  reasonJa: text("reason_ja"),
  evidence: text("evidence"),
  confidence: text("confidence").notNull().default("probable"),
  sourcesJson: text("sources_json"),
});

export const works = pgTable("works", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  externalIdsJson: text("external_ids_json"),
  title: text("title").notNull(),
  titleJa: text("title_ja"),
  originalTitle: text("original_title"),
  workType: text("work_type").notNull(),
  category: text("category").notNull(), // drives Timeline grouping, section 11
  creationStartDate: text("creation_start_date"),
  creationEndDate: text("creation_end_date"),
  displayDate: text("display_date"), // e.g. "c. 1503–1506"
  datePrecision: text("date_precision"), // exact | circa-range | year-only | ...
  creationPlaceId: text("creation_place_id").references(() => places.id),
  currentLocationId: text("current_location_id").references(() => places.id),
  medium: text("medium"),
  dimensions: text("dimensions"), // e.g. "73.7 cm × 92.1 cm"
  currentInstitution: text("current_institution"), // e.g. "Museum of Modern Art, New York"
  description: text("description"),
  descriptionJa: text("description_ja"),
  confidence: text("confidence").notNull().default("verified"),
  sourcesJson: text("sources_json"),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleJa: text("title_ja"),
  description: text("description"),
  descriptionJa: text("description_ja"),
  category: text("category").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  displayDate: text("display_date"),
  significanceScore: integer("significance_score").default(0),
  confidence: text("confidence").notNull().default("verified"),
  sourcesJson: text("sources_json"),
});

export const movements = pgTable("movements", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameJa: text("name_ja"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  description: text("description"),
  descriptionJa: text("description_ja"),
  sourcesJson: text("sources_json"),
});

export const relationships = pgTable("relationships", {
  id: text("id").primaryKey(),
  subjectId: text("subject_id")
    .notNull()
    .references(() => people.id),
  objectId: text("object_id")
    .notNull()
    .references(() => people.id),
  relationshipType: text("relationship_type").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  placeId: text("place_id").references(() => places.id),
  description: text("description"),
  confidence: text("confidence").notNull().default("probable"),
  sourcesJson: text("sources_json"),
});

export const imageAssets = pgTable("image_assets", {
  id: text("id").primaryKey(),
  entityType: text("entity_type").notNull(), // "person" | "work" | "place" | "event"
  entityId: text("entity_id").notNull(),
  imageUrl: text("image_url"),
  thumbnailUrl: text("thumbnail_url"),
  sourceName: text("source_name"),
  sourceRecordUrl: text("source_record_url"),
  creator: text("creator"),
  rightsStatement: text("rights_statement").notNull(),
  license: text("license"),
  licenseUrl: text("license_url"),
  attribution: text("attribution"),
  publicDomain: boolean("public_domain")
    .notNull()
    .default(false),
  commercialUseAllowed: boolean("commercial_use_allowed")
    .notNull()
    .default(false),
  derivativesAllowed: boolean("derivatives_allowed")
    .notNull()
    .default(false),
  lastVerifiedAt: text("last_verified_at"),
  // when null/absent, the UI must render the neutral rights-pending
  // placeholder instead of this record (spec section 19)
});

export const journeys = pgTable("journeys", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleJa: text("title_ja"),
  description: text("description"),
  descriptionJa: text("description_ja"),
});

export const journeySteps = pgTable("journey_steps", {
  id: text("id").primaryKey(),
  journeyId: text("journey_id")
    .notNull()
    .references(() => journeys.id),
  position: integer("position").notNull(),
  stepType: text("step_type").notNull(), // "person" | "work" | "place" | "event" | "movement" | "year"
  stepSlug: text("step_slug").notNull(), // entity slug, or the year itself when stepType is "year"
  caption: text("caption"),
  captionJa: text("caption_ja"),
});

// --- join tables for many-to-many relationships -------------------

export const workCreators = pgTable(
  "work_creators",
  {
    workId: text("work_id")
      .notNull()
      .references(() => works.id),
    personId: text("person_id")
      .notNull()
      .references(() => people.id),
  },
  (t) => [primaryKey({ columns: [t.workId, t.personId] })],
);

export const movementPeople = pgTable(
  "movement_people",
  {
    movementId: text("movement_id")
      .notNull()
      .references(() => movements.id),
    personId: text("person_id")
      .notNull()
      .references(() => people.id),
  },
  (t) => [primaryKey({ columns: [t.movementId, t.personId] })],
);

export const movementWorks = pgTable(
  "movement_works",
  {
    movementId: text("movement_id")
      .notNull()
      .references(() => movements.id),
    workId: text("work_id")
      .notNull()
      .references(() => works.id),
  },
  (t) => [primaryKey({ columns: [t.movementId, t.workId] })],
);

export const eventPlaces = pgTable(
  "event_places",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id),
    placeId: text("place_id")
      .notNull()
      .references(() => places.id),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.placeId] })],
);

export const eventParticipants = pgTable(
  "event_participants",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id),
    personId: text("person_id")
      .notNull()
      .references(() => people.id),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.personId] })],
);

export const eventRelatedWorks = pgTable(
  "event_related_works",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id),
    workId: text("work_id")
      .notNull()
      .references(() => works.id),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.workId] })],
);

// --- relations (for Drizzle's relational query API) ----------------

export const peopleRelations = relations(people, ({ one, many }) => ({
  birthPlace: one(places, {
    fields: [people.birthPlaceId],
    references: [places.id],
    relationName: "birthPlace",
  }),
  deathPlace: one(places, {
    fields: [people.deathPlaceId],
    references: [places.id],
    relationName: "deathPlace",
  }),
  locationPeriods: many(locationPeriods),
  workCreators: many(workCreators),
  movementPeople: many(movementPeople),
  eventParticipants: many(eventParticipants),
}));

export const placesRelations = relations(places, ({ many }) => ({
  locationPeriods: many(locationPeriods),
  worksCreatedHere: many(works, { relationName: "creationPlace" }),
  eventPlaces: many(eventPlaces),
}));

export const worksRelations = relations(works, ({ one, many }) => ({
  creationPlace: one(places, {
    fields: [works.creationPlaceId],
    references: [places.id],
    relationName: "creationPlace",
  }),
  currentLocation: one(places, {
    fields: [works.currentLocationId],
    references: [places.id],
    relationName: "currentLocation",
  }),
  workCreators: many(workCreators),
  movementWorks: many(movementWorks),
  eventRelatedWorks: many(eventRelatedWorks),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  eventPlaces: many(eventPlaces),
  eventParticipants: many(eventParticipants),
  eventRelatedWorks: many(eventRelatedWorks),
}));

export const movementsRelations = relations(movements, ({ many }) => ({
  movementPeople: many(movementPeople),
  movementWorks: many(movementWorks),
}));

export const workCreatorsRelations = relations(workCreators, ({ one }) => ({
  work: one(works, { fields: [workCreators.workId], references: [works.id] }),
  person: one(people, {
    fields: [workCreators.personId],
    references: [people.id],
  }),
}));

export const eventPlacesRelations = relations(eventPlaces, ({ one }) => ({
  event: one(events, {
    fields: [eventPlaces.eventId],
    references: [events.id],
  }),
  place: one(places, {
    fields: [eventPlaces.placeId],
    references: [places.id],
  }),
}));

export const eventParticipantsRelations = relations(
  eventParticipants,
  ({ one }) => ({
    event: one(events, {
      fields: [eventParticipants.eventId],
      references: [events.id],
    }),
    person: one(people, {
      fields: [eventParticipants.personId],
      references: [people.id],
    }),
  }),
);

export const eventRelatedWorksRelations = relations(
  eventRelatedWorks,
  ({ one }) => ({
    event: one(events, {
      fields: [eventRelatedWorks.eventId],
      references: [events.id],
    }),
    work: one(works, {
      fields: [eventRelatedWorks.workId],
      references: [works.id],
    }),
  }),
);

export const movementPeopleRelations = relations(
  movementPeople,
  ({ one }) => ({
    movement: one(movements, {
      fields: [movementPeople.movementId],
      references: [movements.id],
    }),
    person: one(people, {
      fields: [movementPeople.personId],
      references: [people.id],
    }),
  }),
);

export const movementWorksRelations = relations(movementWorks, ({ one }) => ({
  movement: one(movements, {
    fields: [movementWorks.movementId],
    references: [movements.id],
  }),
  work: one(works, { fields: [movementWorks.workId], references: [works.id] }),
}));

export const relationshipsRelations = relations(relationships, ({ one }) => ({
  subject: one(people, {
    fields: [relationships.subjectId],
    references: [people.id],
    relationName: "relationshipSubject",
  }),
  object: one(people, {
    fields: [relationships.objectId],
    references: [people.id],
    relationName: "relationshipObject",
  }),
  place: one(places, {
    fields: [relationships.placeId],
    references: [places.id],
  }),
}));

export { confidenceValues, categoryValues };
