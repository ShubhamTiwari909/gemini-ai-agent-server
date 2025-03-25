import "dotenv/config";
import { compressBase64Image } from "../utils/image-compression.js";
import { History } from "../schemas/History.js";
export const getHistory = async (req, res) => {
    const { email, userId, limit } = req.body;
    let history;
    try {
        if (limit) {
            history = (await History.find({ email, userId }).limit(limit)).reverse();
        }
        else {
            history = (await History.find({ email, userId })).reverse();
        }
        res.json(history); // Use json() instead of send() for sending JSON response
    }
    catch (error) {
        console.error("Error getting history:", error);
        res.status(500).json({ message: "Error retrieving history" }); // Send structured error response
    }
};
export const getHistoryById = async (req, res) => {
    const { id, userId } = req.body;
    try {
        const history = await History.findOne({ _id: id, userId: userId }).lean();
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
    const { userId, username, historyId, email, prompt, response, filePreview, tags } = req.body;
    try {
        const compressedImage = typeof filePreview === "string" && filePreview.includes("image")
            ? await compressBase64Image(filePreview)
            : filePreview || "";
        const newHistory = new History({
            userId,
            historyId,
            email,
            username,
            prompt,
            response,
            filePreview: compressedImage,
            createdAt: new Date().toISOString(),
            tags,
        });
        const result = await newHistory.save();
        res.json({ newHistory: result });
    }
    catch (error) {
        console.error("Error adding history:", error);
        res.status(500).send("Error saving history");
    }
};
