import "dotenv/config";
import { History } from "../schemas/History.js";
import { decrypt } from "../utils/encrypt-decrypt.js";
export const getFeed = async (req, res) => {
    const { limit = 10, page = 1 } = req.body; // Default limit to 10, page to 1
    console.log(page, limit);
    try {
        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;
        // Fetch history with sorting and pagination
        const history = await History.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(parseInt(limit));
        // Decrypt the retrieved history data
        const decryptedHistory = history.map((item) => ({
            ...item.toObject(),
            username: decrypt(item?.username),
            prompt: decrypt(item?.prompt),
            response: decrypt(item?.response),
            filePreview: decrypt(item?.filePreview),
            createdAt: decrypt(item?.createdAt),
        }));
        // Send response with pagination metadata
        res.json({
            data: decryptedHistory,
            currentPage: parseInt(page),
            hasMore: decryptedHistory.length === parseInt(limit), // Check if there are more items
        });
    }
    catch (error) {
        console.error("Error getting history:", error);
        res.status(500).json({ message: "Error retrieving history" });
    }
};
