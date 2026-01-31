import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@business-os/api/src/appRouter';

export const trpc = createTRPCReact<AppRouter>();
