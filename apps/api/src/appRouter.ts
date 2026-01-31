import { router } from './trpc';
import { tenantsRouter } from './features/tenants/router';
import { tableDataRouter } from './features/tableData/router';

export const appRouter = router({
    tenants: tenantsRouter,
    tableData: tableDataRouter,
});

export type AppRouter = typeof appRouter;
