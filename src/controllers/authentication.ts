import express from 'express';
import { createUser,getUserByEmail } from '../db/users';
import { random,authentication } from '../helpers';

export const register: express.RequestHandler = async(req:express.Request,res:express.Response)=>{
    try{
        const {email,password,username}=req.body;

        if(!email||!password||!username){
            res.status(400).json({ error: 'Missing required fields' });
            return; // Ensure no further execution
        }
        const existingUser=await getUserByEmail(email);

        if(existingUser){
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const salt=random();
        const user= await createUser({
            email,
            username,
            authentication:{
                salt,
                password:authentication(salt,password),
            }
        });
        const sessionSalt = random();
        user.authentication.sessionToken = authentication(sessionSalt, user._id.toString());
        await user.save();

  
        res.cookie('TEMPO-AUTH', user.authentication.sessionToken, {
        domain: 'localhost',
        path: '/',
        });

        res.status(201).json(user); // Send the response
        return;

    }catch(error){
        console.log(error);
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
        return;
    }
}
export const login=async (req:express.Request,res:express.Response)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            res.status(400).json({ error: "Email and password are required." });;
            return;
        }
        const user=await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!user){
            res.status(400).json({ error: "User not found." });;
            return;
        }
        const expectedHash=authentication(user.authentication.salt,password);
        if(expectedHash!=user.authentication.password){
            res.status(403).json({ error: "Invalid credentials." });;
            return;
        }

        const salt=random();
        user.authentication.sessionToken=authentication(salt,user._id.toString());
        console.log(user.authentication.sessionToken);
        await user.save();

        res.cookie('TEMPO-AUTH',user.authentication.sessionToken,{domain:'localhost',path:'/'});
        res.status(200).json(user);
        return;
    }catch(error){
        console.error('Login Error:', error);
        res.status(400);
        return;
    }
}