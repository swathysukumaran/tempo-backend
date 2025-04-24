import mongoose from 'mongoose';

const TripSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    tripDetails:Object,
    generatedItinerary:Object,
    sharedWith: {
      type: [
        {
          email: { type: String, required: true },
          permission: {
            type: String,
            enum: ['view','edit'],
            default: 'view'
          }
        }
      ],
      default: [] 
        },

    createdAt:{type:Date,default:Date.now},
});

export const TripModel=mongoose.model('Trip',TripSchema);

export const createNewTrip=async(userId:string,tripDetails:Record<string,any>,generatedItinerary:Record<string,any>)=>{
    console.log("Creating new trip");
    try{
        const trip=new TripModel({
            userId,
            tripDetails,
            generatedItinerary
        });
        const savedTrip = await trip.save();
        console.log("Trip created successfully");
        return savedTrip;  // Return the saved trip
    }catch(err){
        throw new Error(err.message);
    }
    
}

export const updateTripItinerary = async (userId: string, tripId: string, generatedItinerary: Record<string, any>) => {
  console.log("Updating trip itinerary");
  try {
    
    const trip = await TripModel.findById(tripId);
    
   
    if (!trip) {
      throw new Error("Trip not found");
    }
    
    
     if (generatedItinerary.generatedItinerary) {
      trip.generatedItinerary = generatedItinerary.generatedItinerary;
    } else {
      trip.generatedItinerary = generatedItinerary;
    }
    
    
    trip.markModified('generatedItinerary');
    
   
    const updatedTrip = await trip.save();
    
    console.log("Trip itinerary updated successfully", updatedTrip);
    return updatedTrip;
  } catch (err) {
    console.error("Error updating trip itinerary:", err);
    throw new Error(err.message);
  }
};

export const getTripById=async(tripId:string)=>{
    try{       
        const trip=await TripModel.findById(tripId);
        return trip;

    }catch(error){
        throw new Error(error.message);
    }
}

export const getUserTrips = async (userId:string) => {
    try {
        const trips = await TripModel.find({ userId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean();

        return trips;
    } catch (error) {
        throw new Error('Failed to fetch trips');
    }
};