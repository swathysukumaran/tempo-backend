
import express from 'express';
import { isAuthenticated } from '../middlewares';
import { getAllTrips, getTripDetails, shareTrip } from '../controllers/trip';

export default (router:express.Router)=>{
    router.get('/trip-details/:tripId',isAuthenticated,getTripDetails);
    router.get('/trips',isAuthenticated,getAllTrips);
    router.post('/trips/:tripId/share',isAuthenticated,shareTrip);
    
};