import { get } from 'lodash';
import { getTripById,getUserTrips} from '../db/trip';
import { UserModel } from '../db/users';
import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';


export const getTripDetails=async(req:express.Request,res:express.Response)=>{
    try{
        const tripId=req.params.tripId;
        const trip=await getTripById(tripId);
        if(!trip){
            res.status(404).json({error:'Trip not found'});
            return;
        }
        const userId=get(req,'identity._id') as string;
        const user=await UserModel.findById(userId);
        const isOwner=trip.userId.toString()===userId.toString();
        const isShared=trip.sharedWith?.some((entry)=>entry.email=== user.email);
        
        if(!isOwner && !isShared){
            res.status(403).json({error:'Access denied'});
            return;
        }
        res.status(200).json(trip);
        return;

    }catch(error){
        console.log(error);
        res.sendStatus(400);
        return;
    }
}


export const getAllTrips = async (req: express.Request, res: express.Response) => {
    try {
        const userId = get(req, 'identity._id');
        
        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
             return;
        }

        const trips = await getUserTrips(userId);

         res.status(200).json({ trips });
         return;
    } catch (error) {
        console.error('Error fetching user trips:', error);
         res.status(500).json({ error: 'Failed to fetch trips' });
         return;
    }
};

export const shareTrip = async(req:express.Request, res:express.Response)=>{
    try{
        
        const userId=get(req,'identity._id') as string;
        const { email, permission = 'view' }=req.body;
        const tripId=req.params.tripId;
        if(!userId){
            res.status(401).json({error:'User not authenticated'});
            return;
        }
        if(!email){
            res.status(400).json({error:'Email not provided'});
            return;
        }
        const trip=await getTripById(tripId);
        if(!trip){
            res.status(403).json({error:'Trip not found'});
            return;
        }
        
        const targetUser=await UserModel.findOne({email}) ;
        if(!targetUser){
            trip.sharedWith.push({
            email,
            permission
            });
            
        }
        console.log('Target user:',targetUser);
        
        trip.sharedWith?.push({
            email:email,
            permission
        });

        await trip.save();
        await sendTripShareEmail(email, trip._id,userId);
        res.status(200).json({message:'Trip shared successfully'});
        return;

    }catch(error){
        console.error('Error sharing trip:',error);
        res.status(500).json({error:'Failed to share trip'});
        return;
    }
}

export const sendTripShareEmail=async (toEmail:string,tripId:mongoose.Types.ObjectId, userId:string)=>{
    
    const transporter=nodemailer.createTransport({
        service:'SendGrid',
        auth:{
            user:'apikey',
            pass:process.env.SENDGRID_API_KEY,
        }
    });

    const frontendURL=`http://localhost:5173/trip/${tripId}`;
    const inviter=await UserModel.findById(userId);
    if(!inviter){
        console.error('Inviter not found');
        return;
    }
    const inviterName=inviter.username || inviter.email || 'Tempo User';
    await transporter.sendMail({
        from:process.env.SENDER_EMAIL,
        to:toEmail,
        subject:'You have been invited to a trip!',
        html: `<div style="font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif; background-color: #F9FAFB; padding: 24px;">
  <div style="
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #E5E7EB; /* soft gray border */
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06); /* subtle soft shadow */
    ">

    <!-- Header -->
    <div style="background-color: #0D9488; color: white; padding: 28px 24px; text-align: center;">
      <h2 style="margin: 0; font-size: 2rem; font-weight: 700;">🌟 Your Trip is Ready</h2>
      <p style="margin-top: 8px; font-size: 1rem;">Shared with you via <strong>Tempo</strong>, your AI travel companion</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 24px; text-align: center;">
      <p style="font-size: 1rem; color: #374151; margin-bottom: 16px;">
        <strong>${inviterName}</strong> just shared a curated travel plan with you 🌍
      </p>
      <p style="font-size: 0.95rem; color: #6B7280; margin-bottom: 24px;">
        Handpicked hotels, must-see attractions, and personalized tips — your itinerary is just a click away.
      </p>

      <!-- Button -->
      <a href="${frontendURL}" style="
        display: inline-block;
        margin-top: 10px;
        padding: 14px 28px;
        background-color: #D14343;
        color: white;
        text-decoration: none;
        font-weight: 600;
        border-radius: 8px;
        font-size: 1rem;
        transition: background-color 0.3s ease;">
        ✈️ View My Trip Plan
      </a>
    </div>

    <!-- Divider -->
    <div style="border-top: 1px solid #E5E7EB; margin: 0 24px;"></div>

    <!-- Footer -->
    <div style="background-color: #F3F4F6; padding: 20px 24px; text-align: center; font-size: 0.85rem; color: #6B7280;">
      <p style="margin: 0;">👤 Shared by <strong>${inviterName}</strong></p>
      <p style="margin-top: 6px;">Made with 💚 by <strong>Tempo</strong></p>
    </div>

  </div>
</div>

`,
    })
}