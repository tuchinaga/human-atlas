import { defineConfig } from "drizzle-kit";
import "./src/db/load-env";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:localdev@localhost:5432/human_atlas";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
