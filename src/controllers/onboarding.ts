import { getOnboarding, startOnboarding, updateOnboarding } from '../db/onboarding';
import express from 'express';
import { get } from 'lodash';
import { createPreferences } from '../db/userPreferences';

export const createOnboarding = async (req: express.Request, res: express.Response) => {

    try{
        const userId=get(req, 'identity._id');
         if (!userId) {
             res.sendStatus(403); // Unauthorized if no user ID
             return;
        }
        const onboarding=await startOnboarding(userId);
        res.status(200).json({onboarding});
        return;

    }catch(error){
        res.sendStatus(500);
        return;
    }
}

export const updateOnboardingSteps=async(req:express.Request,res:express.Response)=>{
    try{
        const userId=get(req,'identity._id');
        if(!userId){
             res.sendStatus(403);
             return;
        }
        const {status,completedSteps,preferences}=req.body;
        // First check if onboarding exists
        let isOnboarding = await getOnboarding(userId);
        
        if (!isOnboarding) {
            // If no onboarding exists, create it first
            isOnboarding = await startOnboarding(userId);
        }
        const onboarding=await updateOnboarding(userId,status,completedSteps,preferences);

        // If onboarding is completed, save to final preferences
        if (status === 'completed') {
            
            await updateOnboarding(userId,status,completedSteps,preferences);
            await createPreferences(userId, preferences);
            console.log('Preferences created');
        }

        res.status(200).json({onboarding});
        return;

    }catch(error){
        res.sendStatus(500);
        return;
    }
}

export const getOnboardingStatus=async(req:express.Request,res:express.Response)=>{
    
    try{
        const userId=get(req,'identity._id');
        if(!userId){
             res.sendStatus(403);
             return;
        }
        const onboarding=await getOnboarding(userId);
        res.status(200).json({onboarding});
        return;
    }catch(error){
        res.sendStatus(500);
        return;
    }
}

