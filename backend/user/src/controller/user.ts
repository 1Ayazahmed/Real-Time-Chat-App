import { redisClient } from "..";
import { publicToQueue } from "../config/rabbitmq";
import TryCatch from "../config/TryCatch";


// Controller logic: generate OTP → store in Redis → rate limit in Redis → publish “send email job to RabbitMQ”

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;

  const rateLimitKey = `otp-limit:${email}`;
  const rateLimit = await redisClient.get(rateLimitKey);
  if (rateLimit) {
    res.status(492).json({
      message: "Too Many Requests. Please Wait Before Requesting New Otp",
    });
    return;
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;

  await redisClient.set(otpKey, otp, {
    EX: 300, // 5 minutes
  });

  await redisClient.set(rateLimitKey, "true", {
    // user can send otp after one minute
    EX: 60, // 1 minute
  });

  const message = {
    to: email,
    subject: "Your Otp Code",
    body: `Your OTP is ${otp}. is valid for 5 minutes`,
  };

  await publicToQueue("send-otp", message);

  res.status(200).json({
    message: "OTP sent to your mail",
  });
});
