import mongoose from 'mongoose';
import { userInfo } from 'os';
import { useRevalidator } from 'react-router-dom';
import { Interface } from 'readline';
import { getTripById } from './trip';


const PreferencesSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
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
    
},{
    timestamps: true 
});
PreferencesSchema.index({ userId: 1 }, { unique: true });
export const PreferencesModel=mongoose.model('Preferences',PreferencesSchema);


export const createPreferences=async(userId: mongoose.Schema.Types.ObjectId,preferences:Object)=>{

    try{
        const existingPreferences = await PreferencesModel.findOne({ userId });
        
        if (existingPreferences) {
            // If preferences exist, update them
            return await updatePreferences(userId, preferences);
        }
        const newPreferences=new PreferencesModel({
            userId,
            preferences:preferences
        })
         await newPreferences.save(); 
         return newPreferences;

    }catch(error){
        console.log(error);
        throw new Error(error.message);
    }
}

export const updatePreferences=async (userId: mongoose.Schema.Types.ObjectId,preferences:Object)=>{
    try{
        const updatedPreferences = await PreferencesModel.findOneAndUpdate(
            { userId },
            { preferences },
            { new: true }
        );

        if (!updatedPreferences) {
            throw new Error('No preferences found to update');
        }

        return updatedPreferences;
    }catch(error){
        console.log(error);
        throw new Error(error);

    }

}

export const getPreferences=async(userId:mongoose.Schema.Types.ObjectId)=>{
    console.log("Searching for preferences with userId:", userId);
    try{
        const userPreferences=await PreferencesModel.findOne({userId:userId});
          console.log("Found preferences:", userPreferences);
        
        if (!userPreferences) {
            console.log("No preferences found for this user");
            return null;
        }

        // Log the actual preferences being returned
        console.log("Returning preferences:", userPreferences.preferences);
        return userPreferences?userPreferences.preferences:null;
    }
    catch(error){
        console.log(error);
        throw new Error(error);
    }
}