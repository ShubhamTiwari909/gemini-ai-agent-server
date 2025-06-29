import mongoose from "mongoose";
export const User = {
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
    userId: {
        type: String,
        required: true,
    },
};
const CommentUserSchema = new mongoose.Schema(User, { _id: false }); // Prevent auto-generating _id for embedded user
const CommentTypeSchema = {
    id: { type: String, required: true }, // Comment ID
    text: { type: String, required: true }, // Comment content
    user: { type: CommentUserSchema, required: true },
    likes: [User],
    createdAt: String,
};
// Define the base Comment schema
const CommentSchema = new mongoose.Schema({
    ...CommentTypeSchema,
    replies: {
        type: [new mongoose.Schema({
                ...CommentTypeSchema,
            }, { _id: false })],
        default: []
    }
}, { _id: false });
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
    tags: [String],
    likes: [User],
    views: [User],
    downloads: Number,
    comments: {
        type: [CommentSchema],
        default: []
    }
});
export const Posts = mongoose.model("posts", postSchema);
