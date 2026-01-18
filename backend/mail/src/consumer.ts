import amqplib from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
 

export const startSendOtpConsumer = async () =>{
    try {
        const connection = await amqplib.connect({
            protocol: "amqp",
            hostname: process.env.RabbitMQ_HOST,
            port: 5672,
            username: process.env.RabbitMQ_USER,
            password: process.env.RabbitMQ_PASSWORD,
        });
    
} catch (error) {
    console.log("Failed to start rabbitmq consumer", error);
    
    
}
}
