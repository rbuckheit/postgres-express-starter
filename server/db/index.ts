import * as pgPromise from 'pg-promise';
import { IDatabase, IMain } from 'pg-promise';

import { env } from '../env';

// pg-promise initialization options.
const initOptions = {};

// postgres config
const config = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
};

// load and initialize pg-promise
const pgp: IMain = pgPromise(initOptions);

// Create db instance and export it
export const db: IDatabase<void> = pgp(config);

const pg = pgp.pg;

// postgres-promise returns many numeric data types as strings.
// you can configure parsing here to automatically parse these values (when appropriate).
// see: https://stackoverflow.com/questions/39168501/pg-promise-returns-integers-as-strings

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
  return parseFloat(value);
});
