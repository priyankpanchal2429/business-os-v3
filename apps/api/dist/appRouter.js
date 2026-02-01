"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const router_1 = require("./features/tenants/router");
const router_2 = require("./features/tableData/router");
exports.appRouter = (0, trpc_1.router)({
    tenants: router_1.tenantsRouter,
    tableData: router_2.tableDataRouter,
});
