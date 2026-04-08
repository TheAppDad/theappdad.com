import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url?.trim()) return null;
  return drizzle(neon(url), { schema });
}

export type AppDatabase = NonNullable<ReturnType<typeof getDb>>;
