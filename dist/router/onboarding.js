"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onboarding_1 = require("../controllers/onboarding");
const middlewares_1 = require("../middlewares");
exports.default = (router) => {
    router.post('/onboarding/start', onboarding_1.createOnboarding);
    router.put('/onboarding/update', middlewares_1.isAuthenticated, onboarding_1.updateOnboardingSteps);
    router.get('/onboarding/status', middlewares_1.isAuthenticated, onboarding_1.getOnboardingStatus);
};
