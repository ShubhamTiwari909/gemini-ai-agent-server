import "dotenv/config";
import { Request, Response } from "express";
import { History, historySchema } from "../schemas/History.js";
import { FilterQuery } from "mongoose";

export const getFeedWrapper = async (req: Request, res: Response, filter:FilterQuery<typeof historySchema>) => {
    const { limit = 10, page = 1 } = req.body; // Default limit to 10, page to 1
    try {
        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch history with sorting and pagination
        const history = await History.find(filter)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(parseInt(limit));

        // Send response with pagination metadata
        res.json({
            data: history,
            currentPage: parseInt(page),
            hasMore: history.length === parseInt(limit), // Check if there are more items
        });
    } catch (error) {
        console.error("Error getting history:", error);
        res.status(500).json({ message: "Error retrieving history" });
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