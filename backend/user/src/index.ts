import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { createClient } from "redis";
import userRoutes from "./routes/user.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";

dotenv.config();
connectDB();
connectRabbitMQ();
export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
// console.log("Redis URL:", process.env.REDIS_URL);

redisClient
  .connect()
  .then(() => console.log("Connected To Redis Successfully 🛢️"))
  .catch(console.error);

const app = express();
app.use(express.json());
app.use("/api/v1", userRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`User service is running on port ${port}`);
});
