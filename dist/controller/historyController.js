import "dotenv/config";
import { compressBase64Image } from "../utils/image-compression.js";
import { History } from "../schemas/Post.js";
export const getHistory = async (req, res) => {
    const { email, userId, limit } = req.body;
    let history;
    try {
        if (limit) {
            history = (await History.find({ "user.email": email, "user.userId": userId }).limit(limit)).reverse();
        }
        else {
            history = (await History.find({ "user.email": email, "user.userId": userId })).reverse();
        }
        res.json(history); // Use json() instead of send() for sending JSON response
    }
    catch (error) {
        console.error("Error getting history:", error);
        res.status(500).json({ message: "Error retrieving history" }); // Send structured error response
    }
};
export const getHistoryById = async (req, res) => {
    const { id } = req.body;
    try {
        const history = await History.findOne({ _id: id }).lean();
        if (!history) {
            return res.status(404).json({ message: "History not found" });
        }
        res.json(history); // Use json() instead of send() for sending JSON response
    }
    catch (error) {
        console.error("Error getting history:", error);
        res.status(500).json({ message: "Error retrieving history" }); // Send structured error response
    }
};
export const addHistory = async (req, res) => {
    const { user, historyId, prompt, response, responseType, filePreview, tags } = req.body;
    try {
        const compressedImage = typeof filePreview === "string" && filePreview.includes("image")
            ? await compressBase64Image(filePreview)
            : filePreview || "";
        const newHistory = new History({
            user,
            historyId,
            prompt,
            response,
            responseType,
            filePreview: compressedImage,
            createdAt: new Date().toISOString(),
            tags,
            likes: []
        });
        const result = await newHistory.save();
        res.json({ newHistory: result });
    }
    catch (error) {
        console.error("Error adding history:", error);
        res.status(500).send("Error saving history");
    }
};
export const updateLikes = async (req, res) => {
    const { historyId, user } = req.body;
    const history = await History.find({ historyId: historyId, "likes.email": user.email });
    if (history.length === 0) {
        const updatedHistory = await History.findOneAndUpdate({ historyId: historyId }, { $push: { likes: user } }, { new: true } // or `returnDocument: 'after'` if using native MongoDB
        );
        res.json({ likes: updatedHistory?.likes });
    }
    else {
        const updatedHistory = await History.findOneAndUpdate({ historyId: historyId }, { $pull: { likes: user } }, { new: true });
        res.json({ likes: updatedHistory?.likes });
    }
};
