import mongoose from "mongoose";

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
