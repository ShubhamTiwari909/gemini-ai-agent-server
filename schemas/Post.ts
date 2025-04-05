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

export const postSchema = new mongoose.Schema({
  user: User,
  postId: {
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

export const Posts = mongoose.model("posts", postSchema);
