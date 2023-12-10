import { db } from '.';
import { logger } from '../logger';

interface MigrationRow {
  id: number;
  migration_ts: string;
  filename: string;
}

const isInitialized = async (): Promise<boolean> => {
  const existsQuery = `
    SELECT EXISTS (
      SELECT 1
      FROM pg_tables
      WHERE tablename = 'migrations'
    );
  `;
  const row = await db.oneOrNone(existsQuery);
  return row.exists;
};

export const initializeTable = async (): Promise<void> => {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id serial PRIMARY KEY,
      migration_ts timestamp NOT NULL,
      filename text NOT NULL
    );`;

  const isTableInitialized = await isInitialized();

  if (!isTableInitialized) {
    logger.info('[database] creating migrations table');
    await db.oneOrNone(createQuery);
  }
};

const insertMigrationRow = async (fileName: string): Promise<MigrationRow> => {
  const params = [fileName];
  const insertQuery = `
    INSERT INTO migrations(migration_ts, filename)
    SELECT NOW(), $1
    WHERE NOT EXISTS (
      SELECT * FROM migrations
      WHERE filename = $1
    )
    RETURNING *;
  `;

  logger.info(`[database] inserting migration record '${fileName}'`);

  const migrationRow = await db.oneOrNone(insertQuery, params);

  if (migrationRow == null) {
    logger.error(`[database] failed to insert db migration record ${fileName}`);
    throw new Error('failed to insert db migration record');
  } else {
    return migrationRow;
  }
};

export const runMigration = async ({
  sqlFile,
  sqlText,
}: {
  sqlFile: string;
  sqlText: string;
}): Promise<MigrationRow> => {
  await db.any(sqlText);

  const row = await insertMigrationRow(sqlFile);

  logger.info(`[database] executed migration '${sqlFile}'`);
  return row;
};

export const getAllMigratedFiles = async (): Promise<Array<string>> => {
  const results = await db.manyOrNone('SELECT * FROM migrations');
  return results.map((row) => row.filename);
};
