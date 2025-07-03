import { Posts, postSchema } from '../../schemas/Post.js';
import type { FilterQuery } from 'mongoose';
import 'dotenv/config';
import { Request, Response } from 'express';

export const getFeedWrapper = async (
  req: Request,
  res: Response,
  filter: FilterQuery<typeof postSchema>
) => {
  const { limit = 10, page = 1 } = req.body; // Default limit to 10, page to 1
  try {
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch posts with sorting and pagination
    const posts = await Posts.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(parseInt(limit));

    // Send response with pagination metadata
    res.json({
      data: posts,
      currentPage: parseInt(page),
      hasMore: posts.length === parseInt(limit), // Check if there are more items
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ message: 'Error retrieving posts' });
  }
};