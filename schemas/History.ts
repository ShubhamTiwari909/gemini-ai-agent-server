import mongoose from "mongoose";

export const historySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
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
  responseType: {
    type: String,
    required: true
  },
  filePreview: String,
  createdAt: String,
  userId:{
    type: String,
    required:true,
  },
  tags:[String]
});

export const History = mongoose.model("histories", historySchema);
