import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

import { env } from './env';
import { appRouter } from './appRouter';
import { createContext } from './context';
import { logger } from './logger';

const app = express();

// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Logging
app.use(pinoHttp({ logger }));

app.use(cors());
app.use(express.json());

// Clerk Middleware to populate req.auth
app.use(ClerkExpressWithAuth());

app.use(
    '/trpc',
    createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);

app.get('/health', (req, res) => {
    res.send('OK');
});

app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`);
});
