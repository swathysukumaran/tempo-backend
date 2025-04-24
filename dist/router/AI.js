"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const gemini_1 = require("../controllers/gemini");
exports.default = (router) => {
    router.post('/ai/create-trip', middlewares_1.isAuthenticated, gemini_1.createTrip);
    router.post('/ai/update-trip/:tripId', middlewares_1.isAuthenticated, gemini_1.updateItinerary);
};
