import mongoose from "mongoose";

const mongoURL = process.env.MONGO_URI!;

export const dbConnection = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
