import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  historyId: String,
  email: String,
  prompt: String,
  response: String,
  filePreview: String,
});

export const History = mongoose.model("histories", historySchema);
