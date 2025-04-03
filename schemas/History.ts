import mongoose from "mongoose";
import { UserSchema } from "./Users.js";

export const historySchema = new mongoose.Schema({
  user:{
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  historyId: {
    type: String,
    unique: true,
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
  responseType: {
    type: String,
    required: true
  },
  filePreview: String,
  createdAt: String,
  tags:[String]
});

export const History = mongoose.model("histories", historySchema);
