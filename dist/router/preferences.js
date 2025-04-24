"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preferences_1 = require("../controllers/preferences");
const middlewares_1 = require("../middlewares");
exports.default = (router) => {
    router.get('/preferences', middlewares_1.isAuthenticated, preferences_1.getUserPreferences);
    router.put('/preferences', middlewares_1.isAuthenticated, preferences_1.updateUserPreferences);
};
