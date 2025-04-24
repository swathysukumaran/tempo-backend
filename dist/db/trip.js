"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTrips = exports.getTripById = exports.updateTripItinerary = exports.createNewTrip = exports.TripModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TripSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tripDetails: Object,
    generatedItinerary: Object,
    sharedWith: {
        type: [
            {
                email: { type: String, required: true },
                permission: {
                    type: String,
                    enum: ['view', 'edit'],
                    default: 'view'
                }
            }
        ],
        default: []
    },
    createdAt: { type: Date, default: Date.now },
});
exports.TripModel = mongoose_1.default.model('Trip', TripSchema);
const createNewTrip = async (userId, tripDetails, generatedItinerary) => {
    console.log("Creating new trip");
    try {
        const trip = new exports.TripModel({
            userId,
            tripDetails,
            generatedItinerary
        });
        const savedTrip = await trip.save();
        console.log("Trip created successfully");
        return savedTrip; // Return the saved trip
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.createNewTrip = createNewTrip;
const updateTripItinerary = async (userId, tripId, generatedItinerary) => {
    console.log("Updating trip itinerary");
    try {
        const trip = await exports.TripModel.findById(tripId);
        if (!trip) {
            throw new Error("Trip not found");
        }
        if (generatedItinerary.generatedItinerary) {
            trip.generatedItinerary = generatedItinerary.generatedItinerary;
        }
        else {
            trip.generatedItinerary = generatedItinerary;
        }
        trip.markModified('generatedItinerary');
        const updatedTrip = await trip.save();
        console.log("Trip itinerary updated successfully", updatedTrip);
        return updatedTrip;
    }
    catch (err) {
        console.error("Error updating trip itinerary:", err);
        throw new Error(err.message);
    }
};
exports.updateTripItinerary = updateTripItinerary;
const getTripById = async (tripId) => {
    try {
        const trip = await exports.TripModel.findById(tripId);
        return trip;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getTripById = getTripById;
const getUserTrips = async (userId) => {
    try {
        const trips = await exports.TripModel.find({ userId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean();
        return trips;
    }
    catch (error) {
        throw new Error('Failed to fetch trips');
    }
};
exports.getUserTrips = getUserTrips;
