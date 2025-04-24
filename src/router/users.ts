
import { deleteUser ,updateUser} from '../controllers/users';
import express from 'express';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router:express.Router)=>{
   
    router.delete('/users/:id',isAuthenticated,isOwner,deleteUser);
    router.patch('/users/:id',isAuthenticated,isOwner,updateUser);
}

