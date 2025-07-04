import { Posts } from '../../schemas/Post.js';
import { Request, Response } from 'express';

export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.body;
  try {
    const deletedPost = await Posts.findOneAndDelete({ postId }, { new: true });
    res.json({ message: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Error deleting post');
  }
};
