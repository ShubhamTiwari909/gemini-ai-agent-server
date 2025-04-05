import "dotenv/config";
import { Request, Response } from "express";
import { Posts, postSchema } from "../schemas/Post.js";
import { FilterQuery } from "mongoose";

export const getFeedWrapper = async (req: Request, res: Response, filter:FilterQuery<typeof postSchema>) => {
    const { limit = 10, page = 1 } = req.body; // Default limit to 10, page to 1
    try {
        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch posts with sorting and pagination
        const posts = await Posts.find(filter)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(parseInt(limit));

        // Send response with pagination metadata
        res.json({
            data: posts,
            currentPage: parseInt(page),
            hasMore: posts.length === parseInt(limit), // Check if there are more items
        });
    } catch (error) {
        console.error("Error getting posts:", error);
        res.status(500).json({ message: "Error retrieving posts" });
    }
}

export const getFeed = async (req: Request, res: Response) => {
    getFeedWrapper(req, res, {});
};

export const getFeedBySearch = async (req: Request, res: Response) => {
    const { search } = req.body;
    const filter = {prompt: { $regex: search.split(" ").join(".*"), $options: "i" }}
    getFeedWrapper(req, res, filter);
}

export const getFeedByTags = async (req: Request, res: Response) => {
    const { tag } = req.body;
    const filter = { tags: { $in: [tag] } }
    getFeedWrapper(req, res, filter);
}