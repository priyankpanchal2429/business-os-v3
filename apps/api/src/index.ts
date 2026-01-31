import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
// import { clerkMiddleware } from '@clerk/express'; // If available or custom
// Actually @clerk/clerk-sdk-node doesn't export clerkMiddleware directly for express commonly used like this, 
// usually we use `ClerkExpressWithAuth` or similar.
// But we used `req.auth` in context, which requires middleware.
// Let's use `ClerkExpressRequireAuth` or `ClerkExpressWithAuth`.
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

import { env } from './env';
import { appRouter } from './appRouter';
import { createContext } from './context';

const app = express();

app.use(cors());
app.use(express.json());

// Clerk Middleware to populate req.auth
// Note: We use loose auth (WithAuth) to allow public endpoints if needed, 
// but mostly we rely on protectedProcedure to enforce it.
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
    console.log(`Server listening on port ${env.PORT}`);
});
