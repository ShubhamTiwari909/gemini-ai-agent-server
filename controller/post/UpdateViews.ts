import { Posts } from "../../schemas/Post.js";
import { Request, Response } from "express";

export const updateViews = async (req: Request, res: Response) => {
  const { postId, user } = req.body;
  const post = await Posts.find({ postId: postId, 'views.email': user.email });
  if (post.length === 0) {
    const updatedPost = await Posts.findOneAndUpdate(
      { postId: postId },
      { $addToSet: { views: user } },
      { new: true } // or `returnDocument: 'after'` if using native MongoDB
    );
    res.json({ views: updatedPost?.views });
  } else {
    res.json({ message: 'Already viewed' });
  }
};