import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RabbitMQ_HOST,
      port: 5672,
      username: process.env.RabbitMQ_USER,
      password: process.env.RabbitMQ_PASSWORD,
    });

    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ successfully 🐇");
  } catch (error) {
    console.log(`Failed to connect rabbit Mq: ${error}`);
    // process.exit(1);
  }
};

export const publicToQueue = async (queueName: string, message: any) => {
  //queueName  = OTP
  if (!channel) {
    // throw new Error("Channel is not created");
    console.log("RabbitMQ channel is not Initialized");
    return;
  }

  await channel.assertQueue(queueName, { durable: true }); // if there is error it will retry to send the message into the queue
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message))),
    {
      performance: true,
    };
};
