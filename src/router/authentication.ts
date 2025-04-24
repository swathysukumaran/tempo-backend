import express from 'express';

import { register,login } from '../controllers/authentication';

export default (router:express.Router)=>{
    router.post('/auth/register',register);
    router.post('/auth/login',login);
    router.post('/auth/logout', (req, res) => {
        res.clearCookie('TEMPO-AUTH');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};
