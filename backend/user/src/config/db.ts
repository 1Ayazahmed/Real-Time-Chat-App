import mongoose from "mongoose";

const connectDB = async () => {
  const URL = process.env.MONGO_URL;

  if (!URL) {
    throw new Error("MongoDB URL is not defined in environment variables");
  }
  try {
    await mongoose.connect(URL, {
      dbName: "user-service",
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
    process.exit(1);  // if any error occurs this function will get terminated
  }
};
  export default connectDB
