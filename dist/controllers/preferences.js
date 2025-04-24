"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPreferences = exports.getUserPreferences = void 0;
const lodash_1 = require("lodash");
const userPreferences_1 = require("../db/userPreferences");
const getUserPreferences = async (req, res) => {
    try {
        const userId = (0, lodash_1.get)(req, 'identity._id');
        const preferences = await (0, userPreferences_1.getPreferences)(userId);
        res.json({ preferences });
        return;
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};
exports.getUserPreferences = getUserPreferences;
const updateUserPreferences = async (req, res) => {
    try {
        const userId = (0, lodash_1.get)(req, 'identity._id');
        const preferences = (0, lodash_1.get)(req, 'body.preferences');
        if (!userId || !preferences) {
            res.status(400).json({ error: 'Missing required data' });
            return;
        }
        const updatedPreferences = await (0, userPreferences_1.updatePreferences)(userId, preferences);
        res.status(200).json({ preferences: updatedPreferences });
        return;
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};
exports.updateUserPreferences = updateUserPreferences;
