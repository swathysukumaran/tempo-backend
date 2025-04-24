import express from 'express';

import { getUserPreferences,updateUserPreferences } from '../controllers/preferences';
import { isAuthenticated } from '../middlewares';

export default(router:express.Router)=>{
    router.get('/preferences',isAuthenticated,getUserPreferences);
    router.put('/preferences',isAuthenticated,updateUserPreferences);
}