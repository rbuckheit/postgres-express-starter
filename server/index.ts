import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import { env } from './env';
import { logger } from './logger';
import * as migrator from './db/migrator';

import { productsRoute } from './routes/products';

const app = express();

// https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
app.set('trust proxy', env.TRUST_PROXY_COUNT);

// rate limit config
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

// middleware
app.use('/api/', apiLimiter); // activates limiter for api calls only
app.use(morgan(env.MORGAN_MODE)); // server logger
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': [
          "'self'",
          'data:',
          'https://raw.githubusercontent.com/',
          'https://snyk.io/',
        ],
      },
    },
  })
); // header security
app.use(cors()); // cross origin resources
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '300kb' }));

// serve static/build files
app.use(express.static('dist'));

// plug in API routes
app.use('/api/products', productsRoute);

// listen
app.listen(env.SERVER_PORT, () => {
  logger.info(`running '${env.NODE_ENV}' on port ${env.SERVER_PORT}`);
});

// execute pending database migrations once the server is up and running
migrator.runPendingMigrations().catch((e) => {
  logger.error('database migration failed!');
  logger.error(e.message);
  logger.error(e.stack);
  process.exit(3);
});
