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
        const post = await Posts.findOne({ _id: id }).lean();
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    }
    catch (error) {
        console.error("Error getting post:", error);
        res.status(500).json({ message: "Error retrieving post" });
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
            comments: []
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
export const addComment = async (req, res) => {
    const { postId, commentId, commentText, user } = req.body;
    try {
        const updatedPost = await Posts.findOneAndUpdate({ postId }, {
            $push: {
                comments: {
                    id: commentId,
                    text: commentText,
                    user,
                    replies: [] // optional — will default to []
                }
            }
        }, { new: true });
        res.status(200).json({ comments: updatedPost?.comments });
    }
    catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const updateCommentLikes = async (req, res) => {
    const { postId, commentId, user } = req.body;
    try {
        const post = await Posts.findOne({ postId });
        if (!post)
            return res.status(404).json({ message: "Post not found" });
        const comment = post.comments.find((comment) => comment.id === commentId);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        const alreadyLiked = comment.likes?.some((likedUser) => likedUser.email === user.email);
        if (alreadyLiked) {
            comment.likes.pull(user);
        }
        else {
            // Otherwise, push the user into likes
            comment.likes.push(user);
        }
        await post.save();
        return res.status(200).json({ comments: post.comments });
    }
    catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const updateReplyLikes = async (req, res) => {
    const { postId, commentId, replyId, user } = req.body;
    try {
        const post = await Posts.findOne({ postId });
        if (!post)
            return res.status(404).json({ message: "Post not found" });
        const comment = post.comments.find((comment) => comment.id === commentId);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        const reply = comment.replies.find((reply) => reply.id === replyId);
        if (!reply)
            return res.status(404).json({ message: "Reply not found" });
        const alreadyLiked = reply.likes?.some((likedUser) => likedUser.email === user.email);
        if (alreadyLiked) {
            reply.likes.pull(user);
        }
        else {
            // Otherwise, push the user into likes
            reply.likes.push(user);
        }
        await post.save();
        return res.status(200).json({ comments: post.comments });
    }
    catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const addReply = async (req, res) => {
    const { postId, commentId, replyId, replyText, user } = req.body;
    try {
        const updatedPost = await Posts.findOneAndUpdate({
            postId,
            "comments.id": commentId
        }, {
            $push: {
                "comments.$.replies": {
                    id: replyId,
                    text: replyText,
                    user,
                }
            }
        }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: "Post or comment not found" });
        }
        res.status(200).json({ comments: updatedPost.comments });
    }
    catch (error) {
        console.error("Error adding reply:", error);
        res.status(500).json({ message: "Server error" });
    }
};
