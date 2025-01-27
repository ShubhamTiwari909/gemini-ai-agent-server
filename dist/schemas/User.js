import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    userId: String,
    name: String,
    email: String,
});
export const Users = mongoose.model("users", userSchema);
