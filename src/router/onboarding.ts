
import express from 'express';
import { createOnboarding, updateOnboardingSteps, getOnboardingStatus } from '../controllers/onboarding';
import { isAuthenticated } from '../middlewares';

export default (router: express.Router)=> {
    router.post('/onboarding/start',createOnboarding);
    router.put('/onboarding/update',isAuthenticated,updateOnboardingSteps);
    router.get('/onboarding/status',isAuthenticated,getOnboardingStatus);
}