import { Posts } from "../../schemas/Post.js";
import { Request, Response } from "express";
import { compressBase64Image } from "../../utils/image-compression.js";

export const addPost = async (req: Request, res: Response) => {
  const { user, postId, prompt, response, responseType, filePreview, tags, toggle } = req.body;
  try {
    const newPost = new Posts({
      user,
      postId,
      prompt,
      response: responseType === 'image' ? await compressBase64Image(response, user) : response,
      responseType,
      filePreview: filePreview ? await compressBase64Image(filePreview, user) : '',
      createdAt: new Date().toISOString(),
      tags,
      likes: [],
      views: [],
      comments: [],
      toggle,
    });
    const result = await newPost.save();
    res.json({ newPost: result });
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).send('Error saving post');
  }
};