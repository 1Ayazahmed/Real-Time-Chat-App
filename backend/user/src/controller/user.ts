import { redisClient } from "..";
import { generateToken } from "../config/generateToken";
import { publicToQueue } from "../config/rabbitmq";
import TryCatch from "../config/TryCatch";
import { User } from "../model/user";

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

// Verify User

// Verify User

export const verifyUserOtp = TryCatch(async (req, res) => {
  const {email, otp: enteredOtp } = req.body;

  if (!email || !enteredOtp) {
    res.status(400).json({
      message: "Email and Otp Required",
    });
    return;
  }

  const otpKey = `otp:${email}`;

  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp || storedOtp !== enteredOtp) {
    res.status(400).json({
      message: "Invalid or Expired OTP",
    });
    return;
  }

  await redisClient.del(otpKey);
  let user = await User.findOne({ email });

  if (!user) {
    const name = email.slice(0, 8);
    user = await User.create({ name, email });
  }

  const token = generateToken(user);
  res.json({
    message: "User Verified",
    user,
    token,
  });
});