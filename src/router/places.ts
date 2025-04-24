import { lookupPlace } from '../controllers/places';
import express from 'express';

export default(router:express.Router)=>{
    router.post('/lookup-place',lookupPlace);
}