import amqplib from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { log } from "node:console";
dotenv.config();



// connects to RabbitMQ, consumes messages, uses nodemailer to send:

export const startSendOtpConsumer = async () => {
  // constantly listening to the RabbitMQ queue for new messages.
  try {
    const connection = await amqplib.connect({
      protocol: "amqp",
      hostname: process.env.RabbitMQ_HOST,
      port: 5672,
      username: process.env.RabbitMQ_USER,
      password: process.env.RabbitMQ_PASSWORD,
    });

    const channel = await connection.createChannel();
    const queueName = "send-otp";
    await channel.assertQueue(queueName, { durable: true }); // if there is error it will retry to send the message into the queue
    console.log("Consumer Mail Service Started, Listening For Otp Email 🐇 📩  ");
    channel.consume(queueName,async(msg)=>{
        if(msg){
            try{
                const {to,subject,body} = JSON.parse(msg.content.toString())
                const transporter = nodemailer.createTransport({
                    host:"smtp.gmail.com",
                    port:465,
                    auth:{
                        user:process.env.USER,
                        pass:process.env.PASSWORD
                    }
                })
                const sendMail = await transporter.sendMail({
                    to,
                    subject,
                    html:body
                })
                console.log(`OTP Mail Sent To  ${to}`);
                channel.ack(msg);
            }catch(error){
                console.log("Failed To Send Otp:", error);
            }
        }

    })
    
  } catch (error) {
    console.log("Failed to start rabbitmq consumer", error);
  }
};
