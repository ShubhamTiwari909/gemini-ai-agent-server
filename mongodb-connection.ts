import mongoose from "mongoose";
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

const historySchema = new mongoose.Schema({
  historyId: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  filePreview: String,
});

export const History = mongoose.model("histories", historySchema);

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
});

export const Users = mongoose.model("users", userSchema);

export default connectDB;
