import express from "express";
import dotenv from 'dotenv';
import { startSendOtpConsumer } from './consumer.js';

dotenv.config();

console.log('Starting Mail Service...');

// This is the correct place to start the consumer
startSendOtpConsumer(); 

const app = express();

const PORT = process.env.PORT || 50001;

app.listen(PORT,()=>{
    console.log(`Mail File Server is Running on : ${PORT} 📩 `);
    
})