import mongoose from "mongoose";
export const UserSchema = {
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
    image: {
        type: String,
        required: true,
    },
};
const userSchema = new mongoose.Schema(UserSchema);
export const Users = mongoose.model("users", userSchema);
