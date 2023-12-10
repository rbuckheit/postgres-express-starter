import * as fs from 'fs';
import * as path from 'path';

import * as migrations from './migrations';
import { logger } from '../logger';

const MIGRATIONS_PATH = path.join(__dirname, '../../db/migrations');

//
// Invoked at startup to:
// 1. initialize the migrations table if needed.
// 2. execute any SQL migrations which have not yet been run.
//

export const runPendingMigrations = async (): Promise<void> => {
  await migrations.initializeTable();
  const executedMigrations = await migrations.getAllMigratedFiles();
  const allMigrations = fs
    .readdirSync(MIGRATIONS_PATH)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const pendingMigrations = allMigrations.filter(
    (file) => !executedMigrations.includes(file)
  );

  if (pendingMigrations.length > 0) {
    logger.info(
      `[database] running pending migrations: ${pendingMigrations.join(', ')}`
    );
  }

  await Promise.all(
    pendingMigrations.map((sqlFile) => {
      const fullPath = path.join(MIGRATIONS_PATH, sqlFile);
      const sqlText = fs.readFileSync(fullPath).toString();
      return migrations.runMigration({ sqlFile, sqlText });
    })
  );
};
