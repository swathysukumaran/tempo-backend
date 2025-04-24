import express from 'express';
import { get } from 'lodash';
import { getPreferences,updatePreferences } from '../db/userPreferences';

export const getUserPreferences=async(req:express.Request,res:express.Response)=>{
    try{
        const userId=get(req, 'identity._id');
        const preferences=await getPreferences(userId)
        res.json({preferences});
        return;

    }catch(error){
        console.log(error);
        res.sendStatus(400);
        return;
    }
}

export const updateUserPreferences=async(req:express.Request,res:express.Response)=>{
    try{
        const userId=get(req, 'identity._id');
        const preferences=get(req, 'body.preferences');
         if (!userId || !preferences) {
           res.status(400).json({ error: 'Missing required data' });
            return ;
        }
        const updatedPreferences=await updatePreferences(userId,preferences);
         res.status(200).json({ preferences: updatedPreferences });
         return;

    }
    catch(error){
        console.log(error);
        res.sendStatus(400);
        return;
    }
}