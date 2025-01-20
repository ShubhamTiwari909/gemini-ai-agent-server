import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI || "");
    console.log("MongoDB connected successfully!");
    return mongoose.connection.readyState;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return mongoose.connection.readyState;
  }
};

export const Users = mongoose.model("users", {
  userId: String,
  name: String,
  email: String,
});
export const History = mongoose.model("histories", {
  historyId: String,
  email: String,
  prompt: String,
  response: String,
});

export default connectDB;
