"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
exports.default = (router) => {
    router.get('/me', middlewares_1.isAuthenticated, (req, res) => {
        res.status(200).json({
            authenticated: true,
        });
    });
};
