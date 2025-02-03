import "dotenv/config";
import crypto from "crypto";
import { Request, Response } from "express";
import { compressBase64Image } from "../utils/image-compression.js";
import { History } from "../schemas/History.js";

// Encryption function
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""; // REPLACE THIS!

function encrypt(text: string | undefined | null) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  if (text) {
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  }
}

// Decryption function
function decrypt(text: string | undefined | null) {
  if (text) {
    const [iv, encryptedText] = text.split(":");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY, "hex"),
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}

export const getHistory = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const history = (await History.find({ email })).reverse();
    const decryptedHistory = history.map((item) => ({
      ...item.toObject(),
      username: decrypt(item?.username),
      prompt: decrypt(item?.prompt),
      response: decrypt(item?.response),
      filePreview: decrypt(item?.filePreview),
      createdAt: decrypt(item?.createdAt),
    }));
    res.json(decryptedHistory); // Use json() instead of send() for sending JSON response
  } catch (error) {
    console.error("Error getting history:", error);
    res.status(500).json({ message: "Error retrieving history" }); // Send structured error response
  }
};

export const getHistoryById = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const history = await History.findById(id).lean();
    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }
    const decryptedHistory = {
      ...history,
      username: decrypt(history?.username),
      prompt: decrypt(history?.prompt),
      response: decrypt(history?.response),
      filePreview: decrypt(history?.filePreview),
      createdAt: decrypt(history?.createdAt),
    };
    res.json(decryptedHistory); // Use json() instead of send() for sending JSON response
  } catch (error) {
    console.error("Error getting history:", error);
    res.status(500).json({ message: "Error retrieving history" }); // Send structured error response
  }
};

export const addHistory = async (req: Request, res: Response) => {
  const { username, historyId, email, prompt, response, filePreview } =
    req.body;

  try {
    const compressedImage = filePreview
      ? await compressBase64Image(filePreview)
      : "";
    const [
      encryptedUsername,
      encryptedPrompt,
      encryptedResponse,
      encryptedFilePreview,
      encryptedDate,
    ] = await Promise.all([
      encrypt(username),
      encrypt(prompt),
      encrypt(response),
      encrypt(compressedImage),
      encrypt(new Date().toISOString()),
    ]);

    const newHistory = new History({
      historyId,
      email,
      username: encryptedUsername,
      prompt: encryptedPrompt,
      response: encryptedResponse,
      filePreview: encryptedFilePreview,
      createdAt: encryptedDate,
    });
    const result = await newHistory.save();
    res.json({ newHistory: result });
  } catch (error) {
    console.error("Error adding history:", error);
    res.status(500).send("Error saving history");
  }
};
