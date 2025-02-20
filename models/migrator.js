import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { ServiceError } from "infra/erros.js";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
    });
    return pendingMigrations;
  } catch (error) {
    const serviceError = new ServiceError({
      message: "Error listing pending migrations",
      cause: error,
    });
    throw serviceError;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } catch (error) {
    const serviceError = new ServiceError({
      message: "Error running pending migrations",
      cause: error,
    });
    throw serviceError;
  } finally {
    await dbClient?.end();
  }
}
const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
