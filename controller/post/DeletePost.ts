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

export const deleteAllPosts = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    await Posts.deleteMany({ 'user.userId': userId });
    res.json({ message: 'All posts deleted successfully' });
  } catch (error) {
    console.error('Error deleting all posts:', error);
    res.status(500).send('Error deleting all posts');
  }
};
