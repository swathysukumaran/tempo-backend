"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnboarding = exports.updateOnboarding = exports.startOnboarding = exports.OnboardingModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OnboardingSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    currentStep: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started'
    },
    completedSteps: [{
            type: [Number],
            default: []
        }],
    temporaryPreferences: {
        type: Object,
        default: {
            pace: '',
            activities: [],
            startTime: '',
            avoidances: []
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
exports.OnboardingModel = mongoose_1.default.model('Onboarding', OnboardingSchema);
const startOnboarding = async (userId) => {
    try {
        return await exports.OnboardingModel.create({
            userId,
            status: 'in_progress'
        });
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.startOnboarding = startOnboarding;
const updateOnboarding = async (userId, status, completedSteps, preferences) => {
    try {
        return await exports.OnboardingModel.findOneAndUpdate({ userId: userId }, { $addToSet: { completedSteps: { $each: completedSteps } },
            status: status,
            temporaryPreferences: preferences,
            lastUpdated: new Date() }, { new: true });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.updateOnboarding = updateOnboarding;
const getOnboarding = async (userId) => {
    try {
        console.log("indb", userId);
        return await exports.OnboardingModel.findOne({ userId: userId });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getOnboarding = getOnboarding;
