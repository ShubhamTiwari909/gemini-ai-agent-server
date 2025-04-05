import "dotenv/config";
import { compressBase64Image } from "../utils/image-compression.js";
import { Posts } from "../schemas/Post.js";
export const getPosts = async (req, res) => {
    const { email, userId, limit } = req.body;
    let posts;
    try {
        if (limit) {
            posts = (await Posts.find({ "user.email": email, "user.userId": userId }).limit(limit)).reverse();
        }
        else {
            posts = (await Posts.find({ "user.email": email, "user.userId": userId })).reverse();
        }
        res.json(posts); // Use json() instead of send() for sending JSON response
    }
    catch (error) {
        console.error("Error getting posts:", error);
        res.status(500).json({ message: "Error retrieving posts" }); // Send structured error response
    }
};
export const getPostById = async (req, res) => {
    const { id } = req.body;
    try {
        const posts = await Posts.findOne({ _id: id }).lean();
        if (!posts) {
            return res.status(404).json({ message: "Posts not found" });
        }
        res.json(posts); // Use json() instead of send() for sending JSON response
    }
    catch (error) {
        console.error("Error getting posts:", error);
        res.status(500).json({ message: "Error retrieving posts" }); // Send structured error response
    }
};
export const addPost = async (req, res) => {
    const { user, postId, prompt, response, responseType, filePreview, tags } = req.body;
    try {
        const compressedImage = typeof filePreview === "string" && filePreview.includes("image")
            ? await compressBase64Image(filePreview)
            : filePreview || "";
        const newPost = new Posts({
            user,
            postId,
            prompt,
            response,
            responseType,
            filePreview: compressedImage,
            createdAt: new Date().toISOString(),
            tags,
            likes: [],
            views: [],
        });
        const result = await newPost.save();
        res.json({ newPost: result });
    }
    catch (error) {
        console.error("Error adding post:", error);
        res.status(500).send("Error saving post");
    }
};
export const updateLikes = async (req, res) => {
    const { postId, user } = req.body;
    const post = await Posts.find({ postId: postId, "likes.email": user.email });
    if (post.length === 0) {
        const updatedPost = await Posts.findOneAndUpdate({ postId: postId }, { $push: { likes: user } }, { new: true } // or `returnDocument: 'after'` if using native MongoDB
        );
        res.json({ likes: updatedPost?.likes });
    }
    else {
        const updatedPost = await Posts.findOneAndUpdate({ postId: postId }, { $pull: { likes: user } }, { new: true });
        res.json({ likes: updatedPost?.likes });
    }
};
export const updateViews = async (req, res) => {
    const { postId, user } = req.body;
    const post = await Posts.find({ postId: postId, "views.email": user.email });
    if (post.length === 0) {
        const updatedPost = await Posts.findOneAndUpdate({ postId: postId }, { $addToSet: { views: user } }, { new: true } // or `returnDocument: 'after'` if using native MongoDB
        );
        res.json({ views: updatedPost?.views });
    }
    else {
        res.json({ message: "Already viewed" });
    }
};
