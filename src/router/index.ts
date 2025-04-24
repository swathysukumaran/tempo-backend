import express from 'express';
import authentication from './authentication';
import AI from './AI';
import users from './users';
import tripDetails from './tripDetails';


import speechRoutes from './speechRoutes';
import me from './me';
import places from './places';

const router=express.Router();

export default():express.Router=>{
    authentication(router);
    AI(router);
    users(router);
    tripDetails(router);

 
    speechRoutes(router);
    me(router);
    places(router);
    
    return router;
}