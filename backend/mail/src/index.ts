import express from "express";
import dotenv from "dotenv";


dotenv.config();
const app = express();

const PORT = process.env.PORT || 50001;

app.listen(PORT,()=>{
    console.log(`Mail File Server is Running on : ${PORT} 📩 `);
    
})