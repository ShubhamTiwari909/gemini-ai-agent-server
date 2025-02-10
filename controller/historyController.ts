import "dotenv/config";
import { Request, Response } from "express";
import { compressBase64Image } from "../utils/image-compression.js";
import { History } from "../schemas/History.js";
import { decrypt, encrypt } from "../utils/encrypt-decrypt.js";

export const getHistory = async (req: Request, res: Response) => {
  const { email, limit } = req.body;
  let history;
  try {
    if (limit) {
      history = (await History.find({ email }).limit(limit)).reverse();
    } else {
      history = (await History.find({ email })).reverse();
    }
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
      ? !filePreview.includes("image")
        ? filePreview
        : await compressBase64Image(filePreview)
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
