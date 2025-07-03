import { Posts } from "../../schemas/Post.js";
import { Request, Response } from "express";

export const getPostById = async (req: Request, res: Response) => {
  const { id, limit, skip } = req.body;

  try {
    const post = await Posts.findOne({ _id: id }).lean();

    const comments = post?.comments.slice(skip, skip + limit);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post, comments, commentsLength: post?.comments.length });
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({ message: 'Error retrieving post' });
  }
};
