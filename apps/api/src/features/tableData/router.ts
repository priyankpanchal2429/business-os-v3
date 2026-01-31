import { router, tenantProcedure } from '../../trpc';
import { createTableDataSchema, updateTableDataSchema } from './schema';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const tableDataRouter = router({
    list: tenantProcedure.query(async ({ ctx }) => {
        // ENFORCING TENANT ID
        return ctx.prisma.tableData.findMany({
            where: { tenantId: ctx.tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }),

    create: tenantProcedure
        .input(createTableDataSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.tableData.create({
                data: {
                    ...input,
                    tenantId: ctx.tenantId, // ENFORCING TENANT ID
                },
            });
        }),

    update: tenantProcedure
        .input(updateTableDataSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;

            // Verify ownership/existence within tenant
            const existing = await ctx.prisma.tableData.findFirst({
                where: { id, tenantId: ctx.tenantId },
            });

            if (!existing) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return ctx.prisma.tableData.update({
                where: { id },
                data,
            });
        }),

    delete: tenantProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Verify ownership/existence within tenant
            const existing = await ctx.prisma.tableData.findFirst({
                where: { id: input.id, tenantId: ctx.tenantId },
            });

            if (!existing) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return ctx.prisma.tableData.delete({
                where: { id: input.id },
            });
        }),
});
