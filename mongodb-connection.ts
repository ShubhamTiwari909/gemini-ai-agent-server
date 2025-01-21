import mongoose, { Schema } from "mongoose";
import "dotenv/config";

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

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
});

export const Users = mongoose.model("users", userSchema);

const historySchema = new mongoose.Schema({
  historyId: String,
  email: String,
  prompt: String,
  response: String,
});

export const History = mongoose.model("histories", historySchema);

export default connectDB;
