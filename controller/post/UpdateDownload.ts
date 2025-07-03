import { Posts } from '../../schemas/Post.js';
import { Request, Response } from 'express';
export const updateDownloads = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const updatedPost = await Posts.findOneAndUpdate(
      { postId },
      { $inc: { downloads: 1 } },
      { new: true }
    );
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json({ downloads: updatedPost.downloads });
  } catch (error) {
    console.error('Error updating downloads:', error);
    res.status(500).json({ message: 'Error retrieving post' });
  }
};
