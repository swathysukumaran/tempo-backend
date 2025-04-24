import express from 'express';
import {get,identity,merge} from 'lodash';
import {getUserBySessionToken} from '../db/users';

export const isOwner=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{

    try{
        const {id}=req.params;
        const currentUserId=get(req,'identity._id') as string;
        if(!currentUserId){
            res.status(403);
            return;
        }
        if(currentUserId.toString() !== id){
            res.status(403);
            return;
        }
        next();

    }catch(error){
        console.error('Authorization Error:',error);
        res.status(400);
        return

    }
}

export const isAuthenticated=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{

    try{
        const sessionToken=req.cookies['TEMPO-AUTH'];
        if(!sessionToken){
            console.log("first");
            res.status(401).json({error:'Unauthorized'});
            return;
        }
        const existingUser=await getUserBySessionToken(sessionToken);
        if(!existingUser){
            console.log("second");
            res.status(401).json({error:'Unauthorized'});
            return;
        }
        merge(req,{identity:existingUser});
        return next();
    }catch(error){
        console.error('Authentication Error:',error);
        res.status(500).json({error:'Internal Server Error'});
        return

    }
}