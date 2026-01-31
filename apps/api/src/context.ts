import { inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { prisma } from '@business-os/database';
import { env } from './env';

import { WithAuthProp } from '@clerk/clerk-sdk-node';

// Extend Express Request to include Clerk auth
declare global {
    namespace Express {
        interface Request extends WithAuthProp<any> { }
    }
}

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
    const auth = req.auth;

    return {
        req,
        res,
        prisma,
        auth,
        // Helper to get current user/tenant comfortably
        currentUser: auth?.userId ? auth.userId : null,
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;
