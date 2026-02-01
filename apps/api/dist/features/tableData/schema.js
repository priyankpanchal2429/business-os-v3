"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTableDataSchema = exports.createTableDataSchema = void 0;
const zod_1 = require("zod");
exports.createTableDataSchema = zod_1.z.object({
    text: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
exports.updateTableDataSchema = exports.createTableDataSchema.partial().extend({
    id: zod_1.z.string(),
});
