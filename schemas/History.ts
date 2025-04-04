import mongoose from "mongoose";

const User = {
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
}

export const historySchema = new mongoose.Schema({
  user: User,
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
  tags:[String],
  likes:[User]
});

export const History = mongoose.model("histories", historySchema);
