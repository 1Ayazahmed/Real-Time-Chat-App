"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSendOtpConsumer = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const startSendOtpConsumer = async () => {
    // constantly listening to the RabbitMQ queue for new messages.
    try {
        const connection = await amqplib_1.default.connect({
            protocol: "amqp",
            hostname: process.env.RabbitMQ_HOST,
            port: 5672,
            username: process.env.RabbitMQ_USER,
            password: process.env.RabbitMQ_PASSWORD,
        });
        const channel = await connection.createChannel();
        const queueName = "sent-opt";
        await channel.assertQueue(queueName, { durable: true }); // if there is error it will retry to send the message into the queue
        console.log("Consumer Mail Service Started, Listening For Otp Email 🐇 📩  ");
        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString());
                    const transporter = nodemailer_1.default.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        auth: {
                            user: process.env.USER,
                            pass: process.env.PASSWORD
                        }
                    });
                    const sendMail = await transporter.sendMail({
                        to,
                        subject,
                        html: body
                    });
                    console.log(`OTP Mail Sent To  ${to}`);
                    channel.ack(msg);
                }
                catch (error) {
                    console.log("Failed To Send Otp:", error);
                }
            }
        });
    }
    catch (error) {
        console.log("Failed to start rabbitmq consumer", error);
    }
};
exports.startSendOtpConsumer = startSendOtpConsumer;
