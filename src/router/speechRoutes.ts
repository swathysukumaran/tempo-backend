import express from 'express';
import { transcribeAudio } from '../controllers/speechController';

export default (router:express.Router)=>{

router.post('/transcribe', transcribeAudio);

};