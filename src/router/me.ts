import { isAuthenticated } from '../middlewares'; 
import express from 'express';

export default (router: express.Router) => {


  router.get('/me', isAuthenticated, (req, res) => {

    res.status(200).json({
      authenticated: true,
    });
  });
};
