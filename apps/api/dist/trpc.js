"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceRole = exports.tenantProcedure = exports.protectedProcedure = exports.publicProcedure = exports.router = void 0;
const server_1 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
const zod_1 = require("zod");
const t = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof zod_1.ZodError ? error.cause.flatten() : null,
            },
        };
    },
});
exports.router = t.router;
exports.publicProcedure = t.procedure;
// Protected Procedure: Requires Auth
exports.protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.auth?.userId) {
        throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            auth: ctx.auth,
        },
    });
});
// Tenant Procedure: Requires Auth AND Component/Tenant Context
// Wait, we need to know WHICH tenant the user is accessing.
// Usually tenantId is passed in headers or input.
// Architectural Rule 4: "Multi-tenancy must be enforced via tenantId at every data access layer."
// Requirement: "After login, user accesses tenant-scoped app." 
// This implies the URL might be `app.businessos.com/:tenantId` or user has a 'currentTenant'.
// We will enforce tenantId presence in input for tenant-scoped procedures, OR derive it if single-tenant-per-user.
// "Each user belongs to a tenant." (Singular).
// So we can fetch the user's tenant from the DB.
exports.tenantProcedure = exports.protectedProcedure.use(async ({ ctx, next }) => {
    const user = await ctx.prisma.user.findUnique({
        where: { clerkId: ctx.auth.userId },
        include: { tenant: true }, // Needed to check deletedAt
    });
    if (!user) {
        throw new server_1.TRPCError({ code: 'UNAUTHORIZED', message: 'User not found in database' });
    }
    if (user.tenant.deletedAt) {
        throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Tenant has been deactivated' });
    }
    return next({
        ctx: {
            ...ctx,
            user,
            tenantId: user.tenantId,
        },
    });
});
const enforceRole = (role) => exports.tenantProcedure.use(async ({ ctx, next }) => {
    if (!ctx.user) {
        throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
    }
    const roles = ['OWNER', 'ADMIN', 'MEMBER'];
    const userRoleIndex = roles.indexOf(ctx.user.role);
    const requiredRoleIndex = roles.indexOf(role);
    // RBAC Logic: OWNER < ADMIN < MEMBER (Indices: 0 < 1 < 2)
    // Wait, usually Owner has ALL permissions.
    // If required is ADMIN, Owner should pass. 
    // So requiredRoleIndex >= userRoleIndex ? No.
    // Let's explicitly define hierarchy.
    const hierarchy = {
        OWNER: 3,
        ADMIN: 2,
        MEMBER: 1,
    };
    if (hierarchy[ctx.user.role] < hierarchy[role]) {
        throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
    }
    return next();
});
exports.enforceRole = enforceRole;
