import { z } from 'zod';

export const createTableDataSchema = z.object({
    text: z.string().min(1),
    imageUrl: z.string().url().optional().or(z.literal('')),
});

export const updateTableDataSchema = createTableDataSchema.partial().extend({
    id: z.string(),
});
