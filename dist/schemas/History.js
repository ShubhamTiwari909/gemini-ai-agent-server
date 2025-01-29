import mongoose from "mongoose";
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
    createdAt: String,
});
export const History = mongoose.model("histories", historySchema);
