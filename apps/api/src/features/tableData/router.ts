import { router, tenantProcedure } from '../../trpc';
import { createTableDataSchema, updateTableDataSchema } from './schema';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const tableDataRouter = router({
    list: tenantProcedure.query(async ({ ctx }) => {
        return ctx.prisma.tableData.findMany({
            where: {
                tenantId: ctx.tenantId,
                deletedAt: null, // SOFT DELETE FILTER
            },
            orderBy: { createdAt: 'desc' },
        });
    }),

    create: tenantProcedure
        .input(createTableDataSchema)
        .mutation(async ({ ctx, input }) => {
            const data = await ctx.prisma.tableData.create({
                data: {
                    ...input,
                    tenantId: ctx.tenantId,
                },
            });

            // Audit
            await ctx.prisma.auditLog.create({
                data: {
                    action: 'CREATE_TABLE_DATA',
                    entity: 'TableData',
                    entityId: data.id,
                    userId: ctx.user.id,
                    tenantId: ctx.tenantId,
                    details: JSON.stringify({ text: data.text }),
                }
            });

            return data;
        }),

    update: tenantProcedure
        .input(updateTableDataSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;

            const existing = await ctx.prisma.tableData.findFirst({
                where: { id, tenantId: ctx.tenantId, deletedAt: null },
            });

            if (!existing) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            const updated = await ctx.prisma.tableData.update({
                where: { id },
                data,
            });

            // Audit
            await ctx.prisma.auditLog.create({
                data: {
                    action: 'UPDATE_TABLE_DATA',
                    entity: 'TableData',
                    entityId: id,
                    userId: ctx.user.id,
                    tenantId: ctx.tenantId,
                    details: JSON.stringify(data),
                }
            });

            return updated;
        }),

    delete: tenantProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const existing = await ctx.prisma.tableData.findFirst({
                where: { id: input.id, tenantId: ctx.tenantId, deletedAt: null },
            });

            if (!existing) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            // Soft Delete
            await ctx.prisma.tableData.update({
                where: { id: input.id },
                data: { deletedAt: new Date() },
            });

            // Audit
            await ctx.prisma.auditLog.create({
                data: {
                    action: 'DELETE_TABLE_DATA',
                    entity: 'TableData',
                    entityId: input.id,
                    userId: ctx.user.id,
                    tenantId: ctx.tenantId,
                    details: JSON.stringify({ id: input.id }),
                }
            });

            return { success: true };
        }),
});
