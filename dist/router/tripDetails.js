"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const trip_1 = require("../controllers/trip");
exports.default = (router) => {
    router.get('/trip-details/:tripId', middlewares_1.isAuthenticated, trip_1.getTripDetails);
    router.get('/trips', middlewares_1.isAuthenticated, trip_1.getAllTrips);
    router.post('/trips/:tripId/share', middlewares_1.isAuthenticated, trip_1.shareTrip);
};
