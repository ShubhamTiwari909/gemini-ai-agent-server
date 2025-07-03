import { Request, Response } from 'express';
import { Posts } from '../../schemas/Post.js';

export const getPosts = async (req: Request, res: Response) => {
  const { userId, limit, page } = req.body;
  const skip = (page - 1) * limit;
  let posts;

  try {
    if (limit) {
      posts = await Posts.find({ 'user.userId': userId })
        .skip(skip)
        .sort({ createdAt: -1 })
        .limit(limit);
    } else {
      posts = await Posts.find({ 'user.userId': userId }).skip(skip).sort({ createdAt: -1 });
    }
    // Send response with pagination metadata
    res.json({
      data: posts,
      currentPage: parseInt(page),
      hasMore: posts.length === parseInt(limit), // Check if there are more items
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ message: 'Error retrieving posts' }); // Send structured error response
  }
};
