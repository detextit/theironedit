import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export class MissingDatabaseConfigError extends Error {
  constructor() {
    super("Database is not configured. Set DATABASE_URL.");
    this.name = "MissingDatabaseConfigError";
  }
}

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    ""
  );
}

export function hasDatabaseConfig() {
  return Boolean(getConnectionString());
}

// Reuse a single connection across hot reloads / serverless invocations.
const globalForDb = globalThis as unknown as {
  __ironEditSql?: ReturnType<typeof postgres>;
  __ironEditDb?: PostgresJsDatabase<typeof schema>;
};

export function getDb(): PostgresJsDatabase<typeof schema> {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new MissingDatabaseConfigError();
  }

  if (!globalForDb.__ironEditDb) {
    const client =
      globalForDb.__ironEditSql ??
      postgres(connectionString, {
        max: 1,
        prepare: false,
        idle_timeout: 20,
      });
    globalForDb.__ironEditSql = client;
    globalForDb.__ironEditDb = drizzle(client, { schema });
  }

  return globalForDb.__ironEditDb;
}

export { schema };
