import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Validate JWT_SECRET exists
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables. Please add JWT_SECRET to your .env file.");
}

export const generateToken = (user: any) => {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: "15d" });
}