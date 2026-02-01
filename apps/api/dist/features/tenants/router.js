"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantsRouter = void 0;
const trpc_1 = require("../../trpc");
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
exports.tenantsRouter = (0, trpc_1.router)({
    // Get current tenant details
    myTenant: trpc_1.tenantProcedure.query(async ({ ctx }) => {
        return ctx.prisma.tenant.findUnique({
            where: { id: ctx.tenantId },
        });
    }),
    // Create organization (Onboarding)
    // This might be called if user has no tenant
    create: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string().min(1),
        slug: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        // Check if slug taken
        const existing = await ctx.prisma.tenant.findUnique({
            where: { slug: input.slug },
        });
        if (existing) {
            throw new server_1.TRPCError({ code: 'CONFLICT', message: 'Slug already taken' });
        }
        // Create Tenant and User link
        // Transaction to ensure atomicity
        const newTenant = await ctx.prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: input.name,
                    slug: input.slug,
                }
            });
            await tx.user.upsert({
                where: { clerkId: ctx.auth.userId },
                create: {
                    clerkId: ctx.auth.userId,
                    email: input.email,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    tenantId: tenant.id,
                    role: 'OWNER',
                },
                update: {
                    tenantId: tenant.id, // Link to new tenant
                    // Don't update email/names on simple link, or should we?
                    // Let's assume we sync them if provided.
                    email: input.email,
                    firstName: input.firstName,
                    lastName: input.lastName,
                }
            });
            // Audit Log for Creation
            await tx.auditLog.create({
                data: {
                    action: 'CREATE_TENANT',
                    entity: 'Tenant',
                    entityId: tenant.id,
                    userId: (await tx.user.findUniqueOrThrow({ where: { clerkId: ctx.auth.userId } })).id,
                    tenantId: tenant.id,
                    details: JSON.stringify({ name: tenant.name, slug: tenant.slug }),
                }
            });
            return tenant;
        });
        return newTenant;
    }),
});
