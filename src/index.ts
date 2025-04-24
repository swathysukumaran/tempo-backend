import express from 'express';
import http from 'http';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import { SpeechClient } from '@google-cloud/speech';
require('dotenv').config();
const app=express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(compression());
app.use(cookieParser());

const client = new SpeechClient();
const server=http.createServer(app);

server.listen(8081,()=>{
    console.log('Server is running on http://localhost:8081/');
});

const MONGO_URL="mongodb+srv://swathysukumaran:g4pGjXwj22IlponE@cluster0.95gfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.Promise=Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error',(error:Error)=>{console.log(error);});

app.use(bodyparser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Increase URL-encoded payload size limit
app.use(bodyparser.urlencoded({ 
  limit: '50mb', 
  extended: true 
}));
app.use('/',router());
app.use((req, res) => {
  console.log('🔥 Unmatched route:', req.method, req.path);
  res.status(404).json({ error: 'Route not found' });
});