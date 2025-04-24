"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.isOwner = void 0;
const lodash_1 = require("lodash");
const users_1 = require("../db/users");
const isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = (0, lodash_1.get)(req, 'identity._id');
        if (!currentUserId) {
            res.status(403);
            return;
        }
        if (currentUserId.toString() !== id) {
            res.status(403);
            return;
        }
        next();
    }
    catch (error) {
        console.error('Authorization Error:', error);
        res.status(400);
        return;
    }
};
exports.isOwner = isOwner;
const isAuthenticated = async (req, res, next) => {
    try {
        const sessionToken = req.cookies['TEMPO-AUTH'];
        if (!sessionToken) {
            console.log("first");
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const existingUser = await (0, users_1.getUserBySessionToken)(sessionToken);
        if (!existingUser) {
            console.log("second");
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        (0, lodash_1.merge)(req, { identity: existingUser });
        return next();
    }
    catch (error) {
        console.error('Authentication Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
};
exports.isAuthenticated = isAuthenticated;
