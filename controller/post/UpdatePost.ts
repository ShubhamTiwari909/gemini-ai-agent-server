import { Request, Response } from 'express';
import { Posts } from '../../schemas/Post.js';

export const updatePostPrompt = async (req: Request, res: Response) => {
  const { postId, newPrompt } = req.body;
  try {
    const updatedPost = await Posts.findOneAndUpdate(
      { postId },
      { prompt: newPrompt },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).send('Post not found');
    }
    res.json({ updatedPost });
  } catch (error) {
    console.error('Error updating post title:', error);
    res.status(500).send('Error updating post title');
  }
};
