"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnboardingStatus = exports.updateOnboardingSteps = exports.createOnboarding = void 0;
const onboarding_1 = require("../db/onboarding");
const lodash_1 = require("lodash");
const userPreferences_1 = require("../db/userPreferences");
const createOnboarding = async (req, res) => {
    try {
        const userId = (0, lodash_1.get)(req, 'identity._id');
        if (!userId) {
            res.sendStatus(403); // Unauthorized if no user ID
            return;
        }
        const onboarding = await (0, onboarding_1.startOnboarding)(userId);
        res.status(200).json({ onboarding });
        return;
    }
    catch (error) {
        res.sendStatus(500);
        return;
    }
};
exports.createOnboarding = createOnboarding;
const updateOnboardingSteps = async (req, res) => {
    try {
        const userId = (0, lodash_1.get)(req, 'identity._id');
        if (!userId) {
            res.sendStatus(403);
            return;
        }
        const { status, completedSteps, preferences } = req.body;
        // First check if onboarding exists
        let isOnboarding = await (0, onboarding_1.getOnboarding)(userId);
        if (!isOnboarding) {
            // If no onboarding exists, create it first
            isOnboarding = await (0, onboarding_1.startOnboarding)(userId);
        }
        const onboarding = await (0, onboarding_1.updateOnboarding)(userId, status, completedSteps, preferences);
        // If onboarding is completed, save to final preferences
        if (status === 'completed') {
            await (0, onboarding_1.updateOnboarding)(userId, status, completedSteps, preferences);
            await (0, userPreferences_1.createPreferences)(userId, preferences);
            console.log('Preferences created');
        }
        res.status(200).json({ onboarding });
        return;
    }
    catch (error) {
        res.sendStatus(500);
        return;
    }
};
exports.updateOnboardingSteps = updateOnboardingSteps;
const getOnboardingStatus = async (req, res) => {
    try {
        const userId = (0, lodash_1.get)(req, 'identity._id');
        if (!userId) {
            res.sendStatus(403);
            return;
        }
        const onboarding = await (0, onboarding_1.getOnboarding)(userId);
        res.status(200).json({ onboarding });
        return;
    }
    catch (error) {
        res.sendStatus(500);
        return;
    }
};
exports.getOnboardingStatus = getOnboardingStatus;
