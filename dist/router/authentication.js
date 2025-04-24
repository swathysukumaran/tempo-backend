"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../controllers/authentication");
exports.default = (router) => {
    router.post('/auth/register', authentication_1.register);
    router.post('/auth/login', authentication_1.login);
    router.post('/auth/logout', (req, res) => {
        res.clearCookie('TEMPO-AUTH');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};
