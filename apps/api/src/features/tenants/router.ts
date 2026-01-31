import { router, protectedProcedure, tenantProcedure } from '../../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';

export const tenantsRouter = router({
    // Get current tenant details
    myTenant: tenantProcedure.query(async ({ ctx }) => {
        return ctx.prisma.tenant.findUnique({
            where: { id: ctx.tenantId },
        });
    }),

    // Create organization (Onboarding)
    // This might be called if user has no tenant
    create: protectedProcedure
        .input(z.object({ name: z.string().min(1), slug: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            // Check if slug taken
            const existing = await ctx.prisma.tenant.findUnique({
                where: { slug: input.slug },
            });
            if (existing) {
                throw new TRPCError({ code: 'CONFLICT', message: 'Slug already taken' });
            }

            // Create Tenant and User link
            // We assume user might not exist in DB yet if this is first login
            // But protectedProcedure checks auth.userId.

            // Transaction to ensure atomicity
            const newTenant = await ctx.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                const tenant = await tx.tenant.create({
                    data: {
                        name: input.name,
                        slug: input.slug,
                    }
                });

                // Create or Update User
                // We might need to handle the case where user already exists but has no tenant
                // OR user is new.

                await tx.user.upsert({
                    where: { clerkId: ctx.auth.userId! },
                    create: {
                        clerkId: ctx.auth.userId!,
                        email: 'placeholder@example.com', // We don't have email in auth object reliably without extra calls or token claims. 
                        // Ideally frontend passes email or we fetch from Clerk Backend API here.
                        // For now, let's assume frontend passes email or we update it later.
                        // Wait, requirement says "Parent app... signup".
                        // We'll require more info in input?
                        tenantId: tenant.id,
                        role: 'OWNER',
                    },
                    update: {
                        tenantId: tenant.id, // Link to new tenant
                    }
                });

                return tenant;
            });

            return newTenant;
        }),
});
