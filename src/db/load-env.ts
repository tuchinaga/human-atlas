import { config } from "dotenv";
import path from "node:path";

/**
 * Next.js automatically loads .env.local for `next dev`/`build`/`start`,
 * but standalone CLI tools (drizzle-kit, tsx scripts) don't. This makes
 * `npm run db:push` / `npm run db:seed` see the same DATABASE_URL that
 * the app itself uses, without requiring a differently-named env file.
 */
config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });
