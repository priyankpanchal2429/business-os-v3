"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const database_1 = require("@business-os/database");
const createContext = ({ req, res }) => {
    const auth = req.auth;
    return {
        req,
        res,
        prisma: database_1.prisma,
        auth,
        // Helper to get current user/tenant comfortably
        currentUser: auth?.userId ? auth.userId : null,
    };
};
exports.createContext = createContext;
