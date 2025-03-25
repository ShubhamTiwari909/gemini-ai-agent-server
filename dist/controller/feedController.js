import "dotenv/config";
import { History } from "../schemas/History.js";
export const getFeedWrapper = async (req, res, filter) => {
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
    }
    catch (error) {
        console.error("Error getting history:", error);
        res.status(500).json({ message: "Error retrieving history" });
    }
};
export const getFeed = async (req, res) => {
    getFeedWrapper(req, res, {});
};
export const getFeedBySearch = async (req, res) => {
    const { search } = req.body;
    const filter = { prompt: { $regex: search.split(" ").join(".*"), $options: "i" } };
    getFeedWrapper(req, res, filter);
};
export const getFeedByTags = async (req, res) => {
    const { tag } = req.body;
    const filter = { tags: { $in: [tag] } };
    getFeedWrapper(req, res, filter);
};
