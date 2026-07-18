import "./load-env";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

/**
 * DATABASE_URL should point at a PostgreSQL instance — a hosted one
 * (Neon, Supabase, RDS, etc.) for production, or any local Postgres
 * for development. See README.md for setup notes.
 */
const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:localdev@localhost:5432/human_atlas";

declare global {
  var __haPgPool: Pool | undefined;
}

const pool = globalThis.__haPgPool ?? new Pool({ connectionString });

if (process.env.NODE_ENV !== "production") {
  globalThis.__haPgPool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
