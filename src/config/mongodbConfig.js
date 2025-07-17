import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(" MongoDB error:", err.message);
    process.exit(1);
  }
};

export default connectMongoDB;
