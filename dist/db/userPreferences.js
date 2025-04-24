"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreferences = exports.updatePreferences = exports.createPreferences = exports.PreferencesModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PreferencesSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    preferences: {
        type: Object,
        required: true,
        default: {
            pace: '',
            activities: [],
            activityLevel: '',
            startTime: '',
            avoidances: []
        }
    },
}, {
    timestamps: true
});
PreferencesSchema.index({ userId: 1 }, { unique: true });
exports.PreferencesModel = mongoose_1.default.model('Preferences', PreferencesSchema);
const createPreferences = async (userId, preferences) => {
    try {
        const existingPreferences = await exports.PreferencesModel.findOne({ userId });
        if (existingPreferences) {
            // If preferences exist, update them
            return await (0, exports.updatePreferences)(userId, preferences);
        }
        const newPreferences = new exports.PreferencesModel({
            userId,
            preferences: preferences
        });
        await newPreferences.save();
        return newPreferences;
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};
exports.createPreferences = createPreferences;
const updatePreferences = async (userId, preferences) => {
    try {
        const updatedPreferences = await exports.PreferencesModel.findOneAndUpdate({ userId }, { preferences }, { new: true });
        if (!updatedPreferences) {
            throw new Error('No preferences found to update');
        }
        return updatedPreferences;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
};
exports.updatePreferences = updatePreferences;
const getPreferences = async (userId) => {
    console.log("Searching for preferences with userId:", userId);
    try {
        const userPreferences = await exports.PreferencesModel.findOne({ userId: userId });
        console.log("Found preferences:", userPreferences);
        if (!userPreferences) {
            console.log("No preferences found for this user");
            return null;
        }
        // Log the actual preferences being returned
        console.log("Returning preferences:", userPreferences.preferences);
        return userPreferences ? userPreferences.preferences : null;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
};
exports.getPreferences = getPreferences;
