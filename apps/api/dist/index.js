"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const pino_http_1 = require("pino-http");
const express_2 = require("@trpc/server/adapters/express");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const env_1 = require("./env");
const appRouter_1 = require("./appRouter");
const context_1 = require("./context");
const logger_1 = require("./logger");
const app = (0, express_1.default)();
// Security Headers
app.use((0, helmet_1.default)());
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);
// Logging
app.use((0, pino_http_1.pinoHttp)({ logger: logger_1.logger }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Clerk Middleware to populate req.auth
app.use((0, clerk_sdk_node_1.ClerkExpressWithAuth)());
app.use('/trpc', (0, express_2.createExpressMiddleware)({
    router: appRouter_1.appRouter,
    createContext: context_1.createContext,
}));
app.get('/health', (req, res) => {
    res.send('OK');
});
app.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`Server listening on port ${env_1.env.PORT}`);
});
