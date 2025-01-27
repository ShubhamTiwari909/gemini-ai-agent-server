import "dotenv/config";
import crypto from "crypto";
import { compressBase64Image } from "../utils/image-compression.js";
import { History } from "../schemas/History.js";
// Encryption function
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""; // REPLACE THIS!
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
    if (text) {
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return `${iv.toString("hex")}:${encrypted}`;
    }
}
// Decryption function
function decrypt(text) {
    if (text) {
        const [iv, encryptedText] = text.split(":");
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), Buffer.from(iv, "hex"));
        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
}
export const getHistory = async (req, res) => {
    const { email } = req.body;
    try {
        const history = await History.find({ email });
        const decryptedHistory = history.map((item) => ({
            ...item.toObject(), // Convert Mongoose document to plain object
            prompt: decrypt(item?.prompt),
            response: decrypt(item?.response),
            filePreview: decrypt(item?.filePreview),
        }));
        res.send(decryptedHistory);
    }
    catch (error) {
        console.error("Error getting history:", error);
        res.status(500).send("Error retrieving history");
    }
};
export const addHistory = async (req, res) => {
    const { historyId, email, prompt, response, filePreview } = req.body;
    try {
        let compressedImage;
        if (!filePreview) {
            compressedImage = "";
        }
        else {
            compressedImage = await compressBase64Image(filePreview);
        }
        const encryptedPrompt = encrypt(prompt);
        const encryptedResponse = encrypt(response);
        const encryptedFilePreview = encrypt(compressedImage);
        const newHistory = new History({
            historyId,
            email,
            prompt: encryptedPrompt,
            response: encryptedResponse,
            filePreview: encryptedFilePreview,
        });
        const result = await newHistory.save();
        res.send(`History saved - ${result}`);
    }
    catch (error) {
        console.error("Error adding history:", error);
        res.status(500).send("Error saving history");
    }
};
