import express from "express";
import { addPost, getPosts, getPostById, updateLikes, updateViews, addComment, addReply, updateCommentLikes, updateReplyLikes, fetchComments } from "../controller/postController.js";
import { dynamicLimiter } from "../middlewares/rate-limiting.js";
const router = express.Router();
const routes = [
    {
        path: "/add",
        method: (req, res) => addPost(req, res)
    },
    {
        path: "/find",
        method: (req, res) => getPosts(req, res)
    },
    {
        path: "/findById",
        method: (req, res) => getPostById(req, res)
    },
    {
        path: "/updateLikes",
        method: (req, res) => updateLikes(req, res)
    },
    {
        path: "/updateViews",
        method: (req, res) => updateViews(req, res)
    },
    {
        path: "/fetchComments",
        method: (req, res) => fetchComments(req, res)
    },
    {
        path: "/updateComments",
        method: (req, res) => addComment(req, res)
    },
    {
        path: "/updateReplies",
        method: (req, res) => addReply(req, res)
    }, {
        path: "/updateCommentLikes",
        method: (req, res) => updateCommentLikes(req, res)
    },
    {
        path: "/updateReplyLikes",
        method: (req, res) => updateReplyLikes(req, res)
    },
];
routes.map((route) => {
    router.post(route.path, dynamicLimiter(60), async (req, res, next) => {
        try {
            await route.method(req, res);
        }
        catch (error) {
            next(error);
        }
    });
});
export default router;
