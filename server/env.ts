import * as envvar from 'env-var';

export const env = {
  // express server
  SERVER_PORT:
    envvar.get('SERVER_PORT').required().asIntPositive(),
  MORGAN_MODE:
    envvar.get('MORGAN_MODE').required().asEnum(['dev', 'common', 'tiny']),
  NODE_ENV:
    envvar.get('NODE_ENV').required().asEnum(['production', 'development', 'testing']),
  TRUST_PROXY_COUNT:
    envvar.get('TRUST_PROXY_COUNT').required().asInt(),

  // database
  DB_HOST:
    envvar.get('DB_HOST').required().asString(),
  DB_PORT:
    envvar.get('DB_PORT').required().asIntPositive(),
  DB_NAME:
    envvar.get('DB_NAME').required().asString(),
  DB_USER:
    envvar.get('DB_USER').required().asString(),
  DB_PASSWORD:
    envvar.get('DB_PASSWORD').required().asString(),
};
